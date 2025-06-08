// src/pages/createProduct/index.tsx - Página para crear nuevos productos

import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../../contexts";
import { useVendorProducts } from "../../contexts/vendorProductsContext";
import mercadilloService from "../../services";
import { Header, Footer, SimpleBreadcrumb } from "../../componentes";
import {
    type CategoryInterface,
    type ProductFormData,
} from "../../types/types";
import classes from "./createProduct.module.css";

function CreateProduct() {
    const navigate = useNavigate();
    const { user, isAuthenticated } = useUser();
    const { createProduct, state } = useVendorProducts();

    // Estados para categorías
    const [categories, setCategories] = useState<CategoryInterface[]>([]);
    const [loadingCategories, setLoadingCategories] = useState(true);
    const [categoriesError, setCategoriesError] = useState<string | null>(null);

    // Estados del formulario
    const [formData, setFormData] = useState<ProductFormData>({
        name: "",
        description: "",
        price: 0,
        imagen: "",
        categoryIds: [],
    });

    const [formErrors, setFormErrors] = useState<Record<string, string>>({});
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [uploadingImage, setUploadingImage] = useState(false);

    // ============ PROTECCIÓN DE RUTA ============
    useEffect(() => {
        if (!isAuthenticated) {
            navigate("/login");
            return;
        }

        if (user?.role !== "VENDEDOR") {
            navigate("/");
            return;
        }
    }, [isAuthenticated, user, navigate]);

    // ============ CARGAR CATEGORÍAS ============
    useEffect(() => {
        const loadCategories = async () => {
            try {
                setLoadingCategories(true);
                setCategoriesError(null);
                const allCategories = await mercadilloService.getCategories();
                setCategories(allCategories);
            } catch (error: any) {
                setCategoriesError(
                    error.message || "Error al cargar categorías"
                );
            } finally {
                setLoadingCategories(false);
            }
        };

        if (isAuthenticated && user?.role === "VENDEDOR") {
            loadCategories();
        }
    }, [isAuthenticated, user]);

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [initialProductCount, setInitialProductCount] = useState(0);

    // ============ DETECTAR CUANDO SE AGREGA UN PRODUCTO NUEVO ============
    useEffect(() => {
        if (
            state.products.length > initialProductCount &&
            !state.creating &&
            !state.error &&
            isSubmitting
        ) {
            navigate("/mis-productos", { replace: true });
        }
    }, [
        state.products.length,
        initialProductCount,
        state.creating,
        state.error,
        isSubmitting,
        navigate,
    ]);

    // ============ GUARDAR CANTIDAD INICIAL DE PRODUCTOS ============
    useEffect(() => {
        setInitialProductCount(state.products.length);
    }, []); // Solo al montar el componente

    // ============ HANDLERS DEL FORMULARIO ============
    const handleInputChange = useCallback(
        (field: keyof ProductFormData, value: any) => {
            setFormData((prev) => ({ ...prev, [field]: value }));

            // Limpiar error del campo cuando el usuario empiece a escribir
            if (formErrors[field]) {
                setFormErrors((prev) => ({ ...prev, [field]: "" }));
            }
        },
        [formErrors]
    );

    const handleCategoryToggle = useCallback((categoryId: number) => {
        setFormData((prev) => ({
            ...prev,
            categoryIds: prev.categoryIds.includes(categoryId)
                ? prev.categoryIds.filter((id) => id !== categoryId)
                : [...prev.categoryIds, categoryId],
        }));
    }, []);

    const handleImageUpload = useCallback(
        (event: React.ChangeEvent<HTMLInputElement>) => {
            const file = event.target.files?.[0];
            if (!file) return;

            // Validar tamaño (5MB máximo)
            if (file.size > 5 * 1024 * 1024) {
                setFormErrors((prev) => ({
                    ...prev,
                    imagen: "La imagen no puede superar los 5MB",
                }));
                return;
            }

            // Validar tipo
            if (!file.type.startsWith("image/")) {
                setFormErrors((prev) => ({
                    ...prev,
                    imagen: "Solo se permiten archivos de imagen",
                }));
                return;
            }

            setUploadingImage(true);
            setFormErrors((prev) => ({ ...prev, imagen: "" }));

            // Convertir a base64
            const reader = new FileReader();
            reader.onloadend = () => {
                const imageData = reader.result as string;

                // ✅ GUARDAR LA IMAGEN BASE64 REAL
                setImagePreview(imageData);
                setFormData((prev) => ({
                    ...prev,
                    imagen: imageData, // ⬅️ GUARDAR LA IMAGEN REAL, no el placeholder
                }));

                setUploadingImage(false);
            };

            reader.onerror = () => {
                setFormErrors((prev) => ({
                    ...prev,
                    imagen: "Error procesando la imagen",
                }));
                setImagePreview(null);
                setFormData((prev) => ({ ...prev, imagen: "" }));
                setUploadingImage(false);
            };

            reader.readAsDataURL(file);
        },
        []
    );

    const validateForm = useCallback((): boolean => {
        const errors: Record<string, string> = {};

        if (!formData.name.trim()) {
            errors.name = "El nombre es obligatorio";
        } else if (formData.name.length < 3) {
            errors.name = "El nombre debe tener al menos 3 caracteres";
        } else if (formData.name.length > 100) {
            errors.name = "El nombre no puede superar los 100 caracteres";
        }

        if (!formData.description.trim()) {
            errors.description = "La descripción es obligatoria";
        } else if (formData.description.length < 10) {
            errors.description =
                "La descripción debe tener al menos 10 caracteres";
        } else if (formData.description.length > 1000) {
            errors.description =
                "La descripción no puede superar los 1000 caracteres";
        }

        if (!formData.price || formData.price <= 0) {
            errors.price = "El precio debe ser mayor a 0";
        } else if (formData.price > 99999) {
            errors.price = "El precio no puede superar los 99,999€";
        }

        if (formData.categoryIds.length === 0) {
            errors.categoryIds = "Debe seleccionar al menos una categoría";
        } else if (formData.categoryIds.length > 5) {
            errors.categoryIds = "Máximo 5 categorías por producto";
        }

        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    }, [formData]);

    const handleSubmit = useCallback(
        async (event: React.FormEvent) => {
            event.preventDefault();

            // Prevenir múltiples submissions con estado local
            if (isSubmitting || state.creating) {
                return;
            }

            if (!validateForm()) {
                return;
            }

            try {
                setIsSubmitting(true);

                await createProduct(formData);

                // Esperar un poco para que el estado se actualice
                setTimeout(() => {
                    if (!state.error) {
                        navigate("/mis-productos", { replace: true });
                    } else {
                        setIsSubmitting(false);
                    }
                }, 500);
            } catch (error) {
                setIsSubmitting(false);
            }
        },
        [
            formData,
            validateForm,
            createProduct,
            state.creating,
            state.products.length,
            state.error,
            isSubmitting,
            navigate,
        ]
    );

    const handleCancel = useCallback(() => {
        navigate("/mis-productos");
    }, [navigate]);

    // ============ PROTECCIÓN EARLY RETURN ============
    if (!isAuthenticated || user?.role !== "VENDEDOR") {
        return (
            <div className={classes.createProduct}>
                <Header />
                <div className={classes.container}>
                    <div className={classes.accessDenied}>
                        <h2>❌ Acceso Denegado</h2>
                        <p>Solo los vendedores pueden crear productos</p>
                        <button
                            onClick={() => navigate("/")}
                            className={classes.backButton}
                        >
                            ← Volver al inicio
                        </button>
                    </div>
                </div>
                <Footer />
            </div>
        );
    }

    // ============ RENDER PRINCIPAL ============
    return (
        <div className={classes.createProduct}>
            <Header />

            <div className={classes.container}>
                <SimpleBreadcrumb
                    pageName="Crear Producto"
                    parentPath="/mis-productos"
                    parentName="Mis Productos"
                />

                <div className={classes.pageHeader}>
                    <h1 className={classes.pageTitle}>
                        📦 Crear Nuevo Producto
                    </h1>
                    <p className={classes.pageSubtitle}>
                        Añade un nuevo producto a tu catálogo
                    </p>
                </div>

                {/* Banner de error global */}
                {state.error && (
                    <div className={classes.errorBanner}>
                        <span className={classes.errorIcon}>⚠️</span>
                        <span className={classes.errorText}>{state.error}</span>
                    </div>
                )}

                <form onSubmit={handleSubmit} className={classes.productForm}>
                    <div className={classes.formGrid}>
                        {/* Información básica */}
                        <div className={classes.formSection}>
                            <h3 className={classes.sectionTitle}>
                                📝 Información Básica
                            </h3>

                            <div className={classes.formGroup}>
                                <label className={classes.formLabel}>
                                    Nombre del producto *
                                </label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) =>
                                        handleInputChange(
                                            "name",
                                            e.target.value
                                        )
                                    }
                                    className={`${classes.formInput} ${
                                        formErrors.name
                                            ? classes.inputError
                                            : ""
                                    }`}
                                    placeholder="Ej: Tomates cherry ecológicos"
                                    maxLength={100}
                                />
                                {formErrors.name && (
                                    <span className={classes.errorMessage}>
                                        {formErrors.name}
                                    </span>
                                )}
                                <span className={classes.charCount}>
                                    {formData.name.length}/100 caracteres
                                </span>
                            </div>

                            <div className={classes.formGroup}>
                                <label className={classes.formLabel}>
                                    Descripción *
                                </label>
                                <textarea
                                    value={formData.description}
                                    onChange={(e) =>
                                        handleInputChange(
                                            "description",
                                            e.target.value
                                        )
                                    }
                                    className={`${classes.formTextarea} ${
                                        formErrors.description
                                            ? classes.inputError
                                            : ""
                                    }`}
                                    placeholder="Describe tu producto: origen, características, beneficios..."
                                    rows={4}
                                    maxLength={1000}
                                />
                                {formErrors.description && (
                                    <span className={classes.errorMessage}>
                                        {formErrors.description}
                                    </span>
                                )}
                                <span className={classes.charCount}>
                                    {formData.description.length}/1000
                                    caracteres
                                </span>
                            </div>

                            <div className={classes.formGroup}>
                                <label className={classes.formLabel}>
                                    Precio (€) *
                                </label>
                                <input
                                    type="number"
                                    min="0.01"
                                    max="99999"
                                    step="0.01"
                                    value={formData.price || ""}
                                    onChange={(e) =>
                                        handleInputChange(
                                            "price",
                                            parseFloat(e.target.value) || 0
                                        )
                                    }
                                    className={`${classes.formInput} ${
                                        formErrors.price
                                            ? classes.inputError
                                            : ""
                                    }`}
                                    placeholder="0.00"
                                />
                                {formErrors.price && (
                                    <span className={classes.errorMessage}>
                                        {formErrors.price}
                                    </span>
                                )}
                            </div>
                        </div>

                        {/* Imagen */}
                        <div className={classes.formSection}>
                            <h3 className={classes.sectionTitle}>
                                📸 Imagen del Producto
                            </h3>

                            <div className={classes.imageUploadArea}>
                                {imagePreview ? (
                                    <div className={classes.imagePreview}>
                                        <img
                                            src={imagePreview}
                                            alt="Preview del producto"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setImagePreview(null);
                                                setFormData((prev) => ({
                                                    ...prev,
                                                    imagen: "",
                                                }));
                                            }}
                                            className={
                                                classes.removeImageButton
                                            }
                                        >
                                            🗑️ Quitar imagen
                                        </button>
                                    </div>
                                ) : (
                                    <div
                                        className={classes.uploadPlaceholder}
                                        onClick={() =>
                                            document
                                                .getElementById("imageInput")
                                                ?.click()
                                        }
                                    >
                                        <span className={classes.uploadIcon}>
                                            📷
                                        </span>
                                        <p>Haz clic para subir una imagen</p>
                                        <p className={classes.uploadNote}>
                                            JPG, PNG o WebP. Máximo 5MB
                                        </p>
                                    </div>
                                )}

                                <input
                                    id="imageInput"
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageUpload}
                                    className={classes.fileInput}
                                    disabled={uploadingImage}
                                    style={{ display: "none" }}
                                />

                                {uploadingImage && (
                                    <div className={classes.uploadingOverlay}>
                                        <div
                                            className={classes.uploadingSpinner}
                                        ></div>
                                        <p>Procesando imagen...</p>
                                    </div>
                                )}
                            </div>

                            {formErrors.imagen && (
                                <span className={classes.errorMessage}>
                                    {formErrors.imagen}
                                </span>
                            )}
                        </div>
                    </div>

                    {/* Categorías */}
                    <div className={classes.formSection}>
                        <h3 className={classes.sectionTitle}>🏷️ Categorías</h3>

                        {loadingCategories ? (
                            <div className={classes.loadingCategories}>
                                <div className={classes.loadingSpinner}></div>
                                <p>Cargando categorías...</p>
                            </div>
                        ) : categoriesError ? (
                            <div className={classes.errorMessage}>
                                {categoriesError}
                            </div>
                        ) : (
                            <div className={classes.categoriesGrid}>
                                {categories.map((category) => (
                                    <label
                                        key={category.id}
                                        className={classes.categoryOption}
                                    >
                                        <input
                                            type="checkbox"
                                            checked={formData.categoryIds.includes(
                                                category.id
                                            )}
                                            onChange={() =>
                                                handleCategoryToggle(
                                                    category.id
                                                )
                                            }
                                            className={classes.categoryCheckbox}
                                        />
                                        <span className={classes.categoryName}>
                                            {category.name}
                                        </span>
                                    </label>
                                ))}
                            </div>
                        )}

                        {formErrors.categoryIds && (
                            <span className={classes.errorMessage}>
                                {formErrors.categoryIds}
                            </span>
                        )}

                        <p className={classes.categoryNote}>
                            Selecciona entre 1 y 5 categorías que describan tu
                            producto
                        </p>
                    </div>

                    {/* Botones de acción */}
                    <div className={classes.formActions}>
                        <button
                            type="button"
                            onClick={handleCancel}
                            className={classes.cancelButton}
                            disabled={isSubmitting || state.creating}
                        >
                            ✕ Cancelar
                        </button>

                        <button
                            type="submit"
                            className={classes.submitButton}
                            disabled={
                                isSubmitting ||
                                state.creating ||
                                uploadingImage ||
                                !formData.name.trim() ||
                                !formData.description.trim() ||
                                formData.price <= 0 ||
                                formData.categoryIds.length === 0
                            }
                        >
                            {isSubmitting || state.creating ? (
                                <>
                                    <div
                                        className={classes.buttonSpinner}
                                    ></div>
                                    Creando...
                                </>
                            ) : (
                                <>✅ Crear Producto</>
                            )}
                        </button>
                    </div>
                </form>
            </div>

            <Footer />
        </div>
    );
}

export default CreateProduct;
