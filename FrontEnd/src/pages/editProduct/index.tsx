// src/pages/editProduct/index.tsx - Página para editar productos existentes

import React, { useEffect, useState, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useUser } from "../../contexts";
import { useVendorProducts } from "../../contexts/vendorProductsContext";
import mercadilloService from "../../services";
import { Header, Footer, SimpleBreadcrumb } from "../../componentes";
import {
    type CategoryInterface,
    type ProductFormData,
    type ProductInterface,
} from "../../types/types";
import classes from "../createProduct/createProduct.module.css"; // Reutilizamos los estilos

function EditProduct() {
    const navigate = useNavigate();
    const { productId } = useParams<{ productId: string }>();
    const { user, isAuthenticated } = useUser();
    const { updateProduct, state } = useVendorProducts();

    // Estados para categorías
    const [categories, setCategories] = useState<CategoryInterface[]>([]);
    const [loadingCategories, setLoadingCategories] = useState(true);
    const [categoriesError, setCategoriesError] = useState<string | null>(null);

    // Estados para el producto actual
    const [currentProduct, setCurrentProduct] =
        useState<ProductInterface | null>(null);
    const [loadingProduct, setLoadingProduct] = useState(true);
    const [productError, setProductError] = useState<string | null>(null);

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
    const [hasChanges, setHasChanges] = useState(false);

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

        if (!productId || isNaN(Number(productId))) {
            navigate("/mis-productos");
            return;
        }
    }, [isAuthenticated, user, navigate, productId]);

    // ============ CARGAR PRODUCTO ============
    useEffect(() => {
        const loadProduct = async () => {
            if (!productId) return;

            try {
                setLoadingProduct(true);
                setProductError(null);

                // 🔧 INVALIDAR CACHE ANTES de cargar
                const cacheKey = `mercadillo-product-${productId}`;
                localStorage.removeItem(cacheKey);

                // 🔧 USAR mercadilloService con useCache = false
                const product = await mercadilloService.getProduct(
                    Number(productId),
                    false // useCache = false para forzar recarga desde API
                );

                setCurrentProduct(product);

                // Inicializar formulario con datos del producto
                setFormData({
                    name: product.name,
                    description: product.description,
                    price: product.price,
                    imagen: product.img[0] || "",
                    categoryIds: product.categories.map(
                        (cat: CategoryInterface) => cat.id
                    ),
                });

                // Establecer preview de imagen si existe
                if (product.img[0]) {
                    setImagePreview(product.img[0]);
                }
            } catch (error: any) {
                console.error("❌ Error cargando producto:", error);
                setProductError(error.message || "Error al cargar el producto");
            } finally {
                setLoadingProduct(false);
            }
        };

        if (isAuthenticated && user?.role === "VENDEDOR" && productId) {
            loadProduct();
        }
    }, [isAuthenticated, user, productId]);

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

    // ============ DETECTAR CAMBIOS ============
    useEffect(() => {
        if (!currentProduct) return;

        const originalData = {
            name: currentProduct.name,
            description: currentProduct.description,
            price: currentProduct.price,
            imagen: currentProduct.img[0] || "",
            categoryIds: currentProduct.categories
                .map((cat: CategoryInterface) => cat.id)
                .sort(),
        };

        const currentData = {
            ...formData,
            categoryIds: [...formData.categoryIds].sort(),
        };

        const hasChanges =
            JSON.stringify(originalData) !== JSON.stringify(currentData);
        setHasChanges(hasChanges);
    }, [formData, currentProduct]);

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
        async (event: React.ChangeEvent<HTMLInputElement>) => {
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

            try {
                setUploadingImage(true);
                setFormErrors((prev) => ({ ...prev, imagen: "" }));

                // Crear preview local
                const reader = new FileReader();
                reader.onload = (e) => {
                    const imageData = e.target?.result as string;

                    setImagePreview(imageData);

                    // ✅ GUARDAR LA IMAGEN BASE64 REAL
                    setFormData((prev) => ({
                        ...prev,
                        imagen: imageData, // ⬅️ IMAGEN REAL, no placeholder
                    }));
                };
                reader.readAsDataURL(file);
            } catch (error: any) {
                setFormErrors((prev) => ({
                    ...prev,
                    imagen: error.message || "Error subiendo imagen",
                }));
            } finally {
                setUploadingImage(false);
            }
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

            if (!validateForm() || !productId) {
                return;
            }

            if (!hasChanges) {
                navigate("/mis-productos");
                return;
            }

            try {
                await updateProduct(Number(productId), formData);

                // Si no hay errores, redirigir a la lista de productos
                if (!state.error) {
                    navigate("/mis-productos");
                }
            } catch (error) {
                // El error se maneja en el contexto
                console.error("Error actualizando producto:", error);
            }
        },
        [
            formData,
            validateForm,
            updateProduct,
            navigate,
            state.error,
            productId,
            hasChanges,
        ]
    );

    const handleCancel = useCallback(() => {
        if (hasChanges) {
            const confirmLeave = window.confirm(
                "¿Estás seguro de que quieres cancelar? Se perderán los cambios no guardados."
            );
            if (!confirmLeave) return;
        }
        navigate("/mis-productos");
    }, [navigate, hasChanges]);

    // ============ PROTECCIÓN EARLY RETURN ============
    if (!isAuthenticated || user?.role !== "VENDEDOR") {
        return (
            <div className={classes.createProduct}>
                <Header />
                <div className={classes.container}>
                    <div className={classes.accessDenied}>
                        <h2>❌ Acceso Denegado</h2>
                        <p>Solo los vendedores pueden editar productos</p>
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

    if (loadingProduct) {
        return (
            <div className={classes.createProduct}>
                <Header />
                <div className={classes.container}>
                    <div className={classes.loadingState}>
                        <div className={classes.loadingSpinner}></div>
                        <p>Cargando producto...</p>
                    </div>
                </div>
                <Footer />
            </div>
        );
    }

    if (productError || !currentProduct) {
        return (
            <div className={classes.createProduct}>
                <Header />
                <div className={classes.container}>
                    <div className={classes.errorState}>
                        <h2>❌ Error</h2>
                        <p>{productError || "Producto no encontrado"}</p>
                        <button
                            onClick={() => navigate("/mis-productos")}
                            className={classes.backButton}
                        >
                            ← Volver a mis productos
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
                    pageName={`Editar: ${currentProduct.name}`}
                    parentPath="/mis-productos"
                    parentName="Mis Productos"
                />

                <div className={classes.pageHeader}>
                    <h1 className={classes.pageTitle}>✏️ Editar Producto</h1>
                    <p className={classes.pageSubtitle}>
                        Modifica la información de "{currentProduct.name}"
                    </p>
                    {hasChanges && (
                        <div className={classes.changesIndicator}>
                            <span className={classes.changesIcon}>⚠️</span>
                            <span>Tienes cambios sin guardar</span>
                        </div>
                    )}
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
                                        <img src={imagePreview} alt="Preview" />
                                        <div className={classes.imageActions}>
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
                                            <label
                                                className={
                                                    classes.changeImageButton
                                                }
                                            >
                                                📷 Cambiar imagen
                                                <input
                                                    type="file"
                                                    accept="image/*"
                                                    onChange={handleImageUpload}
                                                    className={
                                                        classes.fileInput
                                                    }
                                                    disabled={uploadingImage}
                                                />
                                            </label>
                                        </div>
                                    </div>
                                ) : (
                                    <div className={classes.uploadPlaceholder}>
                                        <span className={classes.uploadIcon}>
                                            📷
                                        </span>
                                        <p>Haz clic para subir una imagen</p>
                                        <p className={classes.uploadNote}>
                                            JPG, PNG o WebP. Máximo 5MB
                                        </p>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={handleImageUpload}
                                            className={classes.fileInput}
                                            disabled={uploadingImage}
                                        />
                                    </div>
                                )}

                                {uploadingImage && (
                                    <div className={classes.uploadingOverlay}>
                                        <div
                                            className={classes.uploadingSpinner}
                                        ></div>
                                        <p>Subiendo imagen...</p>
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
                            disabled={state.updating}
                        >
                            ✕ Cancelar
                        </button>

                        <button
                            type="submit"
                            className={`${classes.submitButton} ${
                                !hasChanges ? classes.submitButtonDisabled : ""
                            }`}
                            disabled={
                                state.updating || uploadingImage || !hasChanges
                            }
                        >
                            {state.updating ? (
                                <>
                                    <div
                                        className={classes.buttonSpinner}
                                    ></div>
                                    Guardando...
                                </>
                            ) : !hasChanges ? (
                                <>✅ Sin cambios</>
                            ) : (
                                <>💾 Guardar Cambios</>
                            )}
                        </button>
                    </div>

                    {/* Información adicional */}
                    <div className={classes.productInfo}>
                        <h3 className={classes.sectionTitle}>
                            ℹ️ Información del Producto
                        </h3>
                        <div className={classes.infoGrid}>
                            <div className={classes.infoItem}>
                                <span className={classes.infoLabel}>ID:</span>
                                <span className={classes.infoValue}>
                                    {currentProduct.id}
                                </span>
                            </div>
                            <div className={classes.infoItem}>
                                <span className={classes.infoLabel}>
                                    Creado:
                                </span>
                                <span className={classes.infoValue}>
                                    {new Date().toLocaleDateString("es-ES")}
                                </span>
                            </div>
                            <div className={classes.infoItem}>
                                <span className={classes.infoLabel}>
                                    Estado:
                                </span>
                                <span className={classes.infoValue}>
                                    Activo
                                </span>
                            </div>
                        </div>
                    </div>
                </form>
            </div>

            <Footer />
        </div>
    );
}

export default EditProduct;
