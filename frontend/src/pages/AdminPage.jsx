import React, { useState, useEffect } from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import Collapse from "@mui/material/Collapse";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import NumberSpinner from "../components/NumberSpinner";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import BlockIcon from "@mui/icons-material/Block";
import LockOpenIcon from "@mui/icons-material/LockOpen";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import CardMedia from "@mui/material/CardMedia";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import { Analytics } from "@vercel/analytics/react";
import { useSnackbar } from "../contexts/SnackbarContext";
import { useAlert } from "../contexts/AlertContext";
import { useAuth } from "../contexts/AuthContext";
import { useCategories } from "../contexts/CategoryContext";
import api from "../utils/api";

const API_URL = import.meta.env.VITE_SERVER_URL;

const TABS = [
  { key: "banners", label: "Banners" },
  { key: "upload", label: "Products" },
  { key: "categories", label: "Categories" },
  { key: "users", label: "Users" },
  { key: "orders", label: "Orders" },
  { key: "analytics", label: "Analytics" },
];

function BannersTab({ onNotify }) {
  const [isLoading, setIsLoading] = useState(false);
  const [banners, setBanners] = useState([]);
  const [form, setForm] = useState({
    images: [],
    previews: [],
  });

  const handleChange = (k) => (e) =>
    setForm((s) => ({ ...s, [k]: e.target.value }));

  const handleFileChange = (event) => {
    const files = Array.from(event.target.files || []);
    const newPreviews = [];
    let loadedCount = 0;

    if (files.length === 0) return;

    files.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        newPreviews.push({
          file,
          preview: reader.result,
        });
        loadedCount++;
        if (loadedCount === files.length) {
          setForm((prev) => ({
            ...prev,
            images: [...prev.images, ...files],
            previews: [...prev.previews, ...newPreviews],
          }));
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const removePreview = (index) => {
    setForm((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
      previews: prev.previews.filter((_, i) => i !== index),
    }));
  };

  const fetchBanners = async () => {
    try {
      const res = await api.get(`/api/v1/admin/banner`);
      if (res.status === 200) {
        setBanners(res.data.data);
      }
    } catch (error) {
      console.error("Error fetching banners:", error);
    }
  };

  useEffect(() => {
    fetchBanners();
  }, []);

  const handleCreate = async () => {
    if (form.images.length === 0) {
      onNotify && onNotify("Please select at least one image", "error");
      return;
    }

    const formData = new FormData();
    form.images.forEach((img) => {
      formData.append("images", img);
    });

    setIsLoading(true);
    try {
      const res = await api.post(`/api/v1/admin/banner/create`, formData);
      if (res.status === 201) {
        onNotify && onNotify("Banners created successfully", "success");
        setForm({ images: [], previews: [] });
        fetchBanners();
      } else throw new Error(res.data.message || "Failed to create banners");
    } catch (err) {
      console.error(err);
      onNotify && onNotify(err.message || "Failed to create banners", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this banner?")) return;
    try {
      const res = await api.delete(`/api/v1/admin/banner/delete/${id}`);
      if (res.status === 200) {
        onNotify && onNotify("Banner deleted successfully", "success");
        fetchBanners();
      } else throw new Error(res.data.message || "Failed to delete banner");
    } catch (err) {
      console.error(err);
      onNotify && onNotify(err.message || "Failed to delete banner", "error");
    }
  };

  return (
    <Box>
      <Paper sx={{ p: 2, mb: 3 }} elevation={2}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Upload Banners
        </Typography>
        <Box
          sx={{
            display: "grid",
            gap: 2,
          }}
        >
          <Box>
            <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600 }}>
              Banner Images
            </Typography>

            {form.previews.length > 0 && (
              <Box sx={{ mb: 3 }}>
                <Typography variant="body2" sx={{ mb: 2, color: "text.secondary" }}>
                  Selected Images ({form.previews.length})
                </Typography>
                <Grid container spacing={2}>
                  {form.previews.map((preview, idx) => (
                    <Grid item xs={6} sm={4} md={3} key={idx}>
                      <Card>
                        <CardMedia
                          component="img"
                          height="150"
                          image={preview.preview}
                          alt={`Preview ${idx + 1}`}
                        />
                        <CardActions sx={{ p: 1 }}>
                          <IconButton
                            size="small"
                            color="error"
                            onClick={() => removePreview(idx)}
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </CardActions>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              </Box>
            )}

            <input
              accept="image/*"
              id="upload-banner-images"
              type="file"
              multiple
              style={{ display: "none" }}
              onChange={handleFileChange}
            />
            <label htmlFor="upload-banner-images">
              <Button variant="contained" component="span">
                {form.previews.length > 0 ? "Add More Images" : "Select Images"}
              </Button>
            </label>
          </Box>
        </Box>

        <Box sx={{ mt: 3, display: "flex", gap: 1 }}>
          <Button variant="contained" onClick={handleCreate} disabled={isLoading || form.images.length === 0}>
            {isLoading ? "Uploading..." : `Upload ${form.previews.length} Banner${form.previews.length !== 1 ? 's' : ''}`}
          </Button>
          {form.previews.length > 0 && (
            <Button
              variant="outlined"
              onClick={() => setForm({ images: [], previews: [] })}
              disabled={isLoading}
            >
              Clear All
            </Button>
          )}
        </Box>
      </Paper>

      <Paper elevation={1} sx={{ p: 2 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Banners List
        </Typography>
        {banners.length === 0 ? (
          <Typography color="textSecondary">No banners found</Typography>
        ) : (
          <Grid container spacing={2}>
            {banners.map((banner) => (
              <Grid item xs={12} sm={6} md={4} key={banner._id}>
                <Card>
                  <CardMedia
                    component="img"
                    height="200"
                    image={Array.isArray(banner.image) ? banner.image[0] : banner.image}
                    alt="Banner"
                  />
                  <CardActions sx={{ justifyContent: "flex-end", p: 1 }}>
                    <IconButton
                      size="small"
                      color="error"
                      onClick={() => handleDelete(banner._id)}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Paper>
    </Box>
  );
}

function ProductsTab({ onNotify }) {
  const [isLoading, setIsLoading] = useState(false);
  const [products, setProducts] = useState([]);
  const [editing, setEditing] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  const { categories, loading: categoriesLoading, refreshCategories } = useCategories();
  const [form, setForm] = useState({
    name: "",
    description: "",
    price: 0,
    category: "",
    brand: "",
    stock: 0,
    images: [],
    newImages: [],
  });

  // Filter products based on search term and category
  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = filterCategory === "" || product.category.category === filterCategory;
    
    return matchesSearch && matchesCategory;
  });

  const fetchProducts = async () => {
    try {
      const res = await fetch(`${API_URL}/api/v1/users/products`);
      const data = await res.json();
      if (res.ok && data.data) {
        setProducts(data.data.products);
        refreshCategories();
      }
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleChange = (k) => (e) =>
    setForm((s) => ({ ...s, [k]: e.target.value }));
  const handleFileChange = (event) => {
    const files = Array.from(event.target.files || []);
    const newImages = [];

    let loadedCount = 0;
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        newImages.push({ file, preview: reader.result });
        loadedCount++;
        if (loadedCount === files.length) {
          setForm((prev) => ({
            ...prev,
            newImages: [...prev.newImages, ...newImages],
          }));
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const removeNewImage = (index) => {
    setForm((prev) => ({
      ...prev,
      newImages: prev.newImages.filter((_, i) => i !== index),
    }));
  };

  const removeExistingImage = (imageIndex) => {
    setForm((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== imageIndex),
    }));
  };

  const handleCreate = async () => {
    const formData = new FormData();
    formData.append("name", form.name);
    formData.append("description", form.description);
    formData.append("price", Number(form.price));
    formData.append("category", form.category);
    formData.append("brand", form.brand);
    formData.append("stock", Number(form.stock));

    form.newImages.forEach((img, idx) => {
      formData.append("images", img.file);
    });
    setIsLoading(true);
    try {
      const res = await api.post(`/api/v1/admin/products/create`, formData);
      if (res.status === 201) {
        onNotify && onNotify(res.data.message, "success");
        setForm({
          name: "",
          description: "",
          price: 0,
          category: "",
          brand: "",
          stock: 0,
          images: [],
          newImages: [],
        });
        fetchProducts();
      } else throw new Error(res.data.message || "Failed");
    } catch (err) {
      onNotify && onNotify(err.message || "Create failed", "error");
    }finally{
      setIsLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this product?")) return;
    try {
      const res = await api.delete(`/api/v1/admin/products/delete/${id}`);
      if (res.status === 200) {
        onNotify && onNotify(res.data.message, "success");
        fetchProducts();
      } else throw new Error(res.data.message || "Delete failed");
    } catch (err) {
      onNotify && onNotify(err.message || "Delete failed", "error");
    }
  };

  const startEdit = (p) => {
    setEditing(p._id);
    setForm({
      name: p.name,
      description: p.description,
      price: p.price,
      category: p.category,
      brand: p.brand,
      stock: p.stock,
      images: p.images || [],
      newImages: [],
    });
  };

  const handleUpdate = async () => {
    const formData = new FormData();
    formData.append("price", Number(form.price));
    formData.append("stock", Number(form.stock));
    formData.append("description", form.description);

    // Send existing images as JSON string
    formData.append("existingImages", JSON.stringify(form.images));

    // Send new images to upload
    form.newImages.forEach((img) => {
      formData.append("images", img.file);
    });

    setIsLoading(true);
    try {
      const res = await api.patch(`/api/v1/admin/products/update/${editing}`, formData);
      if (res.status === 200) {
        onNotify && onNotify(res.data.message, "success");
        setEditing(null);
        fetchProducts();
      } else throw new Error(res.data.message || "Update failed");
    } catch (err) {
      console.error(err)
      onNotify && onNotify(err.message || "Update failed", "error");
    }finally{
      setIsLoading(false);
    }
  };

  return (
    <Box>
      <Paper sx={{ p: 2, mb: 3 }} elevation={2}>
        <Typography variant="h6" sx={{ mb: 1 }}>
          Create / Edit Product
        </Typography>
        <Box
          sx={{
            display: "grid",
            gap: 2,
            gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
          }}
        >
          <TextField
            label="Name"
            value={form.name}
            onChange={handleChange("name")}
            fullWidth
          />

          <FormControl fullWidth disabled={categoriesLoading}>
            <InputLabel>Category</InputLabel>
            <Select
              label="Category"
              value={form.category}
              onChange={handleChange("category")}
            >
              <MenuItem value="">
                <em>Select Category</em>
              </MenuItem>
              {categories?.map((cat) => (
                <MenuItem key={cat._id} value={cat.category}>
                  {cat.category}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            label="Brand"
            value={form.brand}
            onChange={handleChange("brand")}
            fullWidth
          />
          <TextField
            label="Price"
            value={form.price}
            onChange={handleChange("price")}
            fullWidth
          />
          <NumberSpinner
            label="Stock"
            min={1}
            max={500}
            value={form.stock}
            onChange={(value) => setForm((prev) => ({ ...prev, stock: value }))}
            size="small"
          />

          <TextField
            label="Description"
            value={form.description}
            onChange={handleChange("description")}
            multiline
            rows={2}
            fullWidth
          />

          <Box sx={{ gridColumn: "1 / -1" }}>
            <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600 }}>
              Product Images
            </Typography>

            {editing && form.images.length > 0 && (
              <Box sx={{ mb: 3 }}>
                <Typography
                  variant="body2"
                  sx={{ mb: 1, color: "text.secondary" }}
                >
                  Current Images
                </Typography>
                <Grid container spacing={2}>
                  {form.images.map((img, idx) => (
                    <Grid item xs={6} sm={4} md={3} key={idx}>
                      <Card>
                        <CardMedia
                          component="img"
                          height="150"
                          image={img}
                          alt={`Product ${idx + 1}`}
                        />
                        <CardActions sx={{ p: 1 }}>
                          <IconButton
                            size="small"
                            color="error"
                            onClick={() => removeExistingImage(idx)}
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </CardActions>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              </Box>
            )}

            {form.newImages.length > 0 && (
              <Box sx={{ mb: 3 }}>
                <Typography
                  variant="body2"
                  sx={{ mb: 1, color: "text.secondary" }}
                >
                  New Images to Upload
                </Typography>
                <Grid container spacing={2}>
                  {form.newImages.map((img, idx) => (
                    <Grid item xs={6} sm={4} md={3} key={idx}>
                      <Card>
                        <CardMedia
                          component="img"
                          height="150"
                          image={img.preview}
                          alt={`New ${idx + 1}`}
                        />
                        <CardActions sx={{ p: 1 }}>
                          <IconButton
                            size="small"
                            color="error"
                            onClick={() => removeNewImage(idx)}
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </CardActions>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              </Box>
            )}

            <input
              accept="image/*"
              id="upload-images"
              type="file"
              multiple
              style={{ display: "none" }}
              onChange={handleFileChange}
            />
            <label htmlFor="upload-images">
              <Button variant="contained" component="span">
                Add Images
              </Button>
            </label>
          </Box>
        </Box>

        <Box sx={{ mt: 3, display: "flex", gap: 1 }}>
          {!editing ? (
            <Button variant="contained" onClick={handleCreate} disabled={isLoading}>
              {isLoading ? "Creating..." : "Create Product"}
            </Button>
          ) : (
            <>
              <Button variant="contained" onClick={handleUpdate} disabled={isLoading}>
                {isLoading ? "Saving..." : "Save"}
              </Button>
              <Button
                variant="outlined"
                onClick={() => {
                  setEditing(null);
                  setForm({
                    name: "",
                    description: "",
                    price: "",
                    category: "",
                    brand: "",
                    stock: "",
                    images: [],
                    newImages: [],
                  });
                }}
              >
                Cancel
              </Button>
            </>
          )}
        </Box>
      </Paper>

      <Paper sx={{ p: 2, mb: 3 }} elevation={2}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Search & Filter Products
        </Typography>
        <Box
          sx={{
            display: "grid",
            gap: 2,
            gridTemplateColumns: { xs: "1fr", sm: "2fr 1fr" },
            alignItems: "flex-start",
          }}
        >
          <TextField
            label="Search by name, brand, or description"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            fullWidth
            variant="outlined"
            placeholder="Type to search..."
          />
          <FormControl fullWidth>
            <InputLabel>Filter by Category</InputLabel>
            <Select
              label="Filter by Category"
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
            >
              <MenuItem value="">
                <em>All Categories</em>
              </MenuItem>
              {categories?.map((cat) => (
                <MenuItem key={cat._id} value={cat.category}>
                  {cat.category}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
      </Paper>

      <Paper elevation={1} sx={{ p: 2, overflowX: "auto" }}>
        <Box sx={{ minWidth: { xs: "100%", sm: "100%" }, overflowX: "auto" }}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Products List ({filteredProducts.length} result{filteredProducts.length !== 1 ? 's' : ''})
          </Typography>
          <Table sx={{ minWidth: { xs: 300, sm: "100%" } }}>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontSize: { xs: "0.75rem", sm: "0.875rem" } }}>Name</TableCell>
                <TableCell sx={{ fontSize: { xs: "0.75rem", sm: "0.875rem" } }}>Price</TableCell>
                <TableCell sx={{ fontSize: { xs: "0.75rem", sm: "0.875rem" } }}>Stock</TableCell>
                <TableCell sx={{ fontSize: { xs: "0.75rem", sm: "0.875rem" } }}>Category</TableCell>
                <TableCell sx={{ fontSize: { xs: "0.75rem", sm: "0.875rem" } }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredProducts.map((p) => (
                <TableRow key={p._id} hover>
                  <TableCell sx={{ fontSize: { xs: "0.75rem", sm: "0.875rem" } }}>{p.name}</TableCell>
                  <TableCell sx={{ fontSize: { xs: "0.75rem", sm: "0.875rem" } }}>{p.price}</TableCell>
                  <TableCell sx={{ fontSize: { xs: "0.75rem", sm: "0.875rem" } }}>{p.stock}</TableCell>
                  <TableCell sx={{ fontSize: { xs: "0.75rem", sm: "0.875rem" } }}>{p.category.category}</TableCell>
                  <TableCell>
                    <IconButton size="small" onClick={() => startEdit(p)}>
                      <EditIcon fontSize="small" />
                    </IconButton>
                    <IconButton size="small" onClick={() => handleDelete(p._id)} color="error">
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Box>
      </Paper>
    </Box>
  );
}

function CategoriesTab({ onNotify }) {
  const [isLoading, setIsLoading] = useState(false);
  const { categories, loading: categoriesLoading, refreshCategories } = useCategories();
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({
    name: "",
    image: null,
    preview: null,
  });
  const handleChange = (k) => (e) =>
    setForm((s) => ({ ...s, [k]: e.target.value }));

  const handleFileChange = (event) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setForm((prev) => ({
          ...prev,
          image: file,
          preview: reader.result,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCreate = async () => {
    if (!form.name.trim()) {
      onNotify && onNotify("Category name is required", "error");
      return;
    }

    if (!form.image) {
      onNotify && onNotify("Category image is required", "error");
      return;
    }

    const formData = new FormData();
    formData.append("category", form.name);
    formData.append("image", form.image);
    
    setIsLoading(true);
    try {
      const res = await api.post(`/api/v1/admin/category/create`, formData);
      if (res.status === 201) {
        onNotify && onNotify(res.data.message, "success");
        setForm({ name: "", image: null, preview: null });
        refreshCategories();
      } else throw new Error(res.data.message || "Failed");
    } catch (err) {
      console.error(err)
      onNotify && onNotify(err.message || "Create failed", "error");
    }finally{
      setIsLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this category?")) return;
    try {
      const res = await api.delete(`/api/v1/admin/category/${id}`);
      if (res.status === 200) {
        onNotify && onNotify(res.data.message, "success");
        refreshCategories();
      } else throw new Error(res.data.message || "Delete failed");
    } catch (err) {
      onNotify && onNotify(err.message || "Delete failed", "error");
    }
  };

  const startEdit = (cat) => {
    setEditing(cat._id);
    setForm({
      name: cat.category,
      image: null,
      preview: cat.image,
    });
  };

  const handleUpdate = async () => {
    if (!form.name.trim()) {
      onNotify && onNotify("Category name is required", "error");
      return;
    }

    const formData = new FormData();
    formData.append("category", form.name);
    if (form.image) {
      formData.append("image", form.image);
    }
    setIsLoading(true);
    try {
      const res = await api.patch(`/api/v1/admin/category/edit/${editing}`, formData);
      if (res.status === 200) {
        onNotify && onNotify(res.data?.message, "success");
        setEditing(null);
        setForm({ name: "", image: null, preview: null });
        refreshCategories();
      } else throw new Error(res.data?.message || "Update failed");
    } catch (err) {
      onNotify && onNotify(err.message || "Update failed", "error");
    }finally{
      setIsLoading(false);
    }
  };

  return (
    <Box>
      <Paper sx={{ p: 2, mb: 3 }} elevation={2}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Create / Edit Category
        </Typography>
        <Box
          sx={{
            display: "grid",
            gap: 2,
            gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
          }}
        >
          <TextField
            label="Category Name"
            value={form.name}
            onChange={handleChange("name")}
            fullWidth
          />

          <Box sx={{ gridColumn: "1 / -1" }}>
            <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600 }}>
              Category Image
            </Typography>

            {form.preview && (
              <Box sx={{ mb: 3 }}>
                <Card sx={{ maxWidth: 200 }}>
                  <CardMedia
                    component="img"
                    height="200"
                    image={form.preview}
                    alt="Preview"
                  />
                  {form.image && (
                    <CardActions sx={{ p: 1 }}>
                      <Button
                        size="small"
                        color="error"
                        onClick={() =>
                          setForm((prev) => ({
                            ...prev,
                            image: null,
                            preview: null,
                          }))
                        }
                      >
                        Remove
                      </Button>
                    </CardActions>
                  )}
                </Card>
              </Box>
            )}

            <input
              accept="image/*"
              id="upload-category-image"
              type="file"
              style={{ display: "none" }}
              onChange={handleFileChange}
            />
            <label htmlFor="upload-category-image">
              <Button variant="contained" component="span">
                {form.preview ? "Change Image" : "Upload Image"}
              </Button>
            </label>
          </Box>
        </Box>

        <Box sx={{ mt: 3, display: "flex", gap: 1 }}>
          {!editing ? (
            <Button variant="contained" onClick={handleCreate} disabled={isLoading}>
              {isLoading ? "Creating..." : "Create Category"}
            </Button>
          ) : (
            <>
              <Button variant="contained" onClick={handleUpdate} disabled={isLoading}>
                {isLoading ? "Saving..." : "Save"}
              </Button>
              <Button
                variant="outlined"
                onClick={() => {
                  setEditing(null);
                  setForm({ name: "", image: null, preview: null });
                }}
              >
                Cancel
              </Button>
            </>
          )}
        </Box>
      </Paper>

      <Paper elevation={1} sx={{ p: 2 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Categories List
        </Typography>
        {categories?.length === 0 ? (
          <Typography color="textSecondary">No categories found</Typography>
        ) : (
          <Grid container spacing={2}>
            {categories?.map((cat) => (
              <Grid item xs={6} sm={4} md={3} key={cat._id}>
                <Card>
                  <CardMedia
                    component="img"
                    height="200"
                    image={cat.image}
                    alt={cat.name}
                  />
                  <CardActions sx={{ justifyContent: "space-between", p: 1 }}>
                    <Typography variant="subtitle2">{cat.category}</Typography>
                    <Box>
                      <IconButton size="small" onClick={() => startEdit(cat)}>
                        <EditIcon fontSize="small" />
                      </IconButton>
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => handleDelete(cat._id)}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Box>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Paper>
    </Box>
  );
}

function UsersTab({ onNotify }) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchUserUidsFromOrders = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/api/v1/admin/user`);
      if (res.status === 200) {
        const usersSet = new Set(res.data.data.map((o) => o));
        setUsers(Array.from(usersSet));
      } else {
        onNotify && onNotify(res.data.message || "Failed to fetch orders", "error");
      }
    } catch (err) {
      console.error(err);
      onNotify && onNotify("Network error", "error");
    }finally{
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserUidsFromOrders();
  }, []);

  const handleBan = async (uid) => {
    try {
      const res = await api.post(`/api/v1/admin/ban/${uid}`);
      if (res.status === 200) onNotify && onNotify(res.data.message, "success");
      else throw new Error(res.data.message || "Failed");
    } catch (err) {
      onNotify && onNotify(err.message || "Ban failed", "error");
    }
  };

  const handleUnban = async (uid) => {
    try {
      const res = await api.post(`/api/v1/admin/unban/${uid}`);
      if (res.status === 200) onNotify && onNotify(res.data.message, "success");
      else throw new Error(res.data.message || "Failed");
    } catch (err) {
      onNotify && onNotify(data.message || "Unban failed", "error");
    }
  };

  return (
    <Box>
      <Paper sx={{ p: 2 }}>
        <Box sx={{ mb: 2 }}>
          <Button
            variant="contained"
            onClick={fetchUserUidsFromOrders}
            disabled={loading}
          >
            Refresh Users
          </Button>
        </Box>
        {users.length === 0 ? (
          <div>No users found (try refreshing)</div>
        ) : (
          <Box sx={{ overflowX: "auto" }}>
            <Table sx={{ minWidth: { xs: 300, sm: "100%" } }}>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontSize: { xs: "0.75rem", sm: "0.875rem" } }}>NAME</TableCell>
                  <TableCell sx={{ fontSize: { xs: "0.75rem", sm: "0.875rem" } }}>EMAIL</TableCell>
                  <TableCell sx={{ fontSize: { xs: "0.75rem", sm: "0.875rem" } }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user._id}>
                    <TableCell sx={{ fontSize: { xs: "0.75rem", sm: "0.875rem" } }}>{user.name}</TableCell>
                    <TableCell sx={{ fontSize: { xs: "0.75rem", sm: "0.875rem" } }}>{user.email}</TableCell>
                    <TableCell>
                      <IconButton size="small" onClick={() => handleBan(user._uid)}>
                        <BlockIcon fontSize="small" />
                      </IconButton>
                      <IconButton size="small" onClick={() => handleUnban(user._uid)}>
                        <LockOpenIcon fontSize="small" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Box>
        )}
      </Paper>
    </Box>
  );
}

function OrdersTab({ onNotify }) {
  const [orders, setOrders] = useState([]);
  const [expanded, setExpanded] = useState(null);

  const handleAddressToggle = (id) => {
    setExpanded(prev => (prev === id ? null : id));
  };

  const fetchOrders = async () => {
    try {
      const res = await api.get(`/api/v1/admin/orders`);
      if (res.status === 200) {
        setOrders(res.data.data);
      } else
        onNotify && onNotify(res.data.message || "Failed to fetch orders", "error");
    } catch (err) {
      console.error(err);
      onNotify && onNotify(err.message || "Network error", "error");
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleStatusChange = async (orderId, status) => {
    try {
      const res = await api.patch(`/api/v1/admin/order/${orderId}`, { orderStatus: status });
      if (res.status === 200) {
        onNotify && onNotify(res.data.message, "success");
        fetchOrders();
      } else throw new Error(res.data.message || "Update failed");
    } catch (err) {
      onNotify && onNotify(err.message || "Update failed", "error");
    }
  };

  return (
    <Box>
      <Paper sx={{ p: 1, overflowX: "auto" }}>
        <Box sx={{ minWidth: { xs: 400, sm: "100%" }, overflowX: "auto" }}>
          <Table sx={{ minWidth: { xs: 400, sm: "100%" } }}>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontSize: { xs: "0.7rem", sm: "0.875rem" } }} />
                <TableCell sx={{ fontSize: { xs: "0.7rem", sm: "0.875rem" } }}>Order ID</TableCell>
                <TableCell sx={{ fontSize: { xs: "0.7rem", sm: "0.875rem" } }}>User</TableCell>
                <TableCell sx={{ fontSize: { xs: "0.7rem", sm: "0.875rem" } }}>Total</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {orders.map((o) => console.log(o.items))}
              {orders.map((o) => (
                <React.Fragment key={o._id}>
                  <TableRow hover>
                    <TableCell>
                      <IconButton size="small" onClick={() => handleAddressToggle(o._id)}>
                        {expanded === o._id ? (
                          <KeyboardArrowUpIcon fontSize="small" />
                        ) : (
                          <KeyboardArrowDownIcon fontSize="small" />
                        )}
                      </IconButton>
                    </TableCell>

                    <TableCell sx={{ fontSize: { xs: "0.7rem", sm: "0.875rem" } }}>{o._id}</TableCell>

                    <TableCell sx={{ fontSize: { xs: "0.7rem", sm: "0.875rem" } }}>
                      {o.user?.name} ({o.user?.email})
                    </TableCell>

                    <TableCell sx={{ fontSize: { xs: "0.7rem", sm: "0.875rem" } }}>{o.productPrice}</TableCell>
                  </TableRow>

                  
                  <TableRow>
                    <TableCell colSpan={4} sx={{ p: 0 }}>
                      <Collapse in={expanded === o._id} timeout="auto" unmountOnExit>
                        <Paper sx={{ m: 2, p: 2, backgroundColor: "action.hover" }}>
                          <Box sx={{ mb: 3 }}>
                            <Typography variant="h6" gutterBottom sx={{ fontSize: { xs: "0.9rem", sm: "1.25rem" } }}>
                              Order Status & Actions
                            </Typography>
                            <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
                              <Typography sx={{ fontSize: { xs: "0.75rem", sm: "0.875rem" } }}>
                                Status: <strong>{o.orderStatus}</strong>
                              </Typography>
                              <FormControl size="small" sx={{ minWidth: { xs: 120, sm: 140 } }}>
                                <InputLabel sx={{ fontSize: { xs: "0.7rem", sm: "0.875rem" } }}>Update Status</InputLabel>
                                <Select
                                  value={o.orderStatus}
                                  label="Update Status"
                                  onChange={(e) =>
                                    handleStatusChange(o._id, e.target.value)
                                  }
                                  sx={{ fontSize: { xs: "0.7rem", sm: "0.875rem" } }}
                                >
                                  <MenuItem value="pending">pending</MenuItem>
                                  <MenuItem value="confirmed">confirmed</MenuItem>
                                  <MenuItem value="shipped">shipped</MenuItem>
                                  <MenuItem value="delivered">delivered</MenuItem>
                                  <MenuItem value="cancelled">cancelled</MenuItem>
                                  <MenuItem value="returned">returned</MenuItem>
                                </Select>
                              </FormControl>
                            </Box>
                          </Box>

                          <Box sx={{ mb: 3 }}>
                            <Typography variant="h6" gutterBottom sx={{ fontSize: { xs: "0.9rem", sm: "1.25rem" } }}>
                              Products
                            </Typography>
                            {o.items && o.items.length > 0 ? (
                              <Table size="small">
                                <TableHead>
                                  <TableRow>
                                    <TableCell sx={{ fontSize: { xs: "0.7rem", sm: "0.875rem" }, fontWeight: "bold" }}>Product ID</TableCell>
                                    <TableCell sx={{ fontSize: { xs: "0.7rem", sm: "0.875rem" }, fontWeight: "bold" }}>Name</TableCell>
                                    <TableCell sx={{ fontSize: { xs: "0.7rem", sm: "0.875rem" }, fontWeight: "bold" }}>Quantity</TableCell>
                                    <TableCell sx={{ fontSize: { xs: "0.7rem", sm: "0.875rem" }, fontWeight: "bold" }}>Price</TableCell>
                                  </TableRow>
                                </TableHead>
                                <TableBody>
                                  {o.items.map((item, index) => (
                                    <TableRow key={index}>
                                      <TableCell sx={{ fontSize: { xs: "0.7rem", sm: "0.875rem" } }}>{item.product || 'N/A'}</TableCell>
                                      <TableCell sx={{ fontSize: { xs: "0.7rem", sm: "0.875rem" } }}>{item.name}</TableCell>
                                      <TableCell sx={{ fontSize: { xs: "0.7rem", sm: "0.875rem" } }}>{item.quantity}</TableCell>
                                      <TableCell sx={{ fontSize: { xs: "0.7rem", sm: "0.875rem" } }}>{item.price}</TableCell>
                                    </TableRow>
                                  ))}
                                </TableBody>
                              </Table>
                            ) : (
                              <Typography sx={{ fontSize: { xs: "0.75rem", sm: "0.875rem" } }}>No products found</Typography>
                            )}
                          </Box>

                          <Box>
                            <Typography variant="h6" gutterBottom sx={{ fontSize: { xs: "0.9rem", sm: "1.25rem" } }}>
                              Shipping Address
                            </Typography>
                            <Typography sx={{ fontSize: { xs: "0.75rem", sm: "0.875rem" } }}>
                              {(o.shippingAddress)}
                            </Typography>
                            <Typography sx={{ fontSize: { xs: "0.75rem", sm: "0.875rem" } }}>country:{o.shippingAddress?.country || "India"}</Typography>
                            <Typography sx={{ fontSize: { xs: "0.75rem", sm: "0.875rem" } }}>Phone: {o.user?.phone}</Typography>
                          </Box>
                        </Paper>
                      </Collapse>
                    </TableCell>
                  </TableRow>
                </React.Fragment>
              ))}
            </TableBody>

          </Table>
        </Box>
      </Paper>
    </Box>
  );
}

function AnalyticsTab({ onNotify }) {
  return (
    <Box>
      <Paper sx={{ p: 3, mb: 3 }} elevation={2}>
        <Typography variant="h6" sx={{ mb: 2, fontWeight: "bold" }}>
          Website Analytics
        </Typography>
        <Typography variant="body2" sx={{ color: "text.secondary", mb: 2 }}>
          Real-time analytics powered by Vercel Analytics. Monitor your website's performance metrics, user behavior, and vital statistics.
        </Typography>
        <Box sx={{ bgcolor: "#f5f5f5", p: 2, borderRadius: 1, mb: 2 }}>
          <Typography variant="body2" sx={{ mb: 1 }}>
            <strong>Web Vitals Tracked:</strong>
          </Typography>
          <ul style={{ margin: "8px 0", paddingLeft: "20px" }}>
            <li>
              <Typography variant="body2">
                <strong>First Input Delay (FID):</strong> Measures responsiveness to user interactions
              </Typography>
            </li>
            <li>
              <Typography variant="body2">
                <strong>Cumulative Layout Shift (CLS):</strong> Measures visual stability
              </Typography>
            </li>
            <li>
              <Typography variant="body2">
                <strong>Largest Contentful Paint (LCP):</strong> Measures perceived load speed
              </Typography>
            </li>
            <li>
              <Typography variant="body2">
                <strong>First Paint (FP):</strong> Measures when the page starts to render
              </Typography>
            </li>
            <li>
              <Typography variant="body2">
                <strong>First Contentful Paint (FCP):</strong> Measures when the first content is painted
              </Typography>
            </li>
          </ul>
        </Box>
        <Typography variant="body2" sx={{ color: "text.secondary" }}>
          View detailed analytics data in your <strong>Vercel Dashboard</strong> at vercel.com/analytics
        </Typography>
      </Paper>

      <Paper sx={{ p: 3 }} elevation={2}>
        <Typography variant="h6" sx={{ mb: 2, fontWeight: "bold" }}>
          Analytics Component Status
        </Typography>
        <Box sx={{ bgcolor: "#e8f5e9", p: 2, borderRadius: 1, border: "1px solid #4caf50" }}>
          <Typography variant="body2" sx={{ color: "#1b5e20" }}>
            ✓ Vercel Analytics component is active and monitoring your application's performance metrics in real-time.
          </Typography>
        </Box>
      </Paper>

      <Analytics />
    </Box>
  );
}

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState(0);
  const { showSnackbar } = useSnackbar();
  const { user } = useAuth();

  const onNotify = (message, variant = "info") =>
    showSnackbar(message, variant === "error" ? "error" : variant, 3000);

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "background.default" }}>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography variant="h4" sx={{ mb: 3, fontWeight: "bold" }}>
          Admin Dashboard {user ? `- ${user.name}` : ""}
        </Typography>

        <Paper sx={{ mb: 3, overflowX: "auto" }} elevation={2}>
          <Tabs
            value={activeTab}
            onChange={(e, v) => setActiveTab(v)}
            indicatorColor="primary"
            textColor="primary"
            variant="scrollable"
            scrollButtons="auto"
            allowScrollButtonsMobile
            sx={{
              "& .MuiTab-root": {
                fontSize: { xs: "0.75rem", sm: "0.875rem" },
                padding: { xs: "8px 12px", sm: "12px 16px" },
                minWidth: { xs: "80px", sm: "auto" },
                flex: { sm: 1 },
              },
            }}
          >
            {TABS.map((t) => (
              <Tab key={t.key} label={t.label} />
            ))}
          </Tabs>
        </Paper>

        <Box sx={{ mt: 3, overflowX: "hidden" }}>
          {activeTab === 0 && <BannersTab onNotify={onNotify} />}
          {activeTab === 1 && <ProductsTab onNotify={onNotify} />}
          {activeTab === 2 && <CategoriesTab onNotify={onNotify} />}
          {activeTab === 3 && <UsersTab onNotify={onNotify} />}
          {activeTab === 4 && <OrdersTab onNotify={onNotify} />}
          {activeTab === 5 && <AnalyticsTab onNotify={onNotify} />}
        </Box>
      </Container>
    </Box>
  );
}
