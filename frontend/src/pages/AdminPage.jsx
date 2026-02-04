import React, { useState, useEffect } from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
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
import { useSnackbar } from "../contexts/SnackbarContext";
import { useAuth } from "../contexts/AuthContext";
import { useCategories } from "../contexts/CategoryContext";

const API_URL = import.meta.env.VITE_SERVER_URL; // adjust if your backend runs elsewhere

const TABS = [
  { key: "upload", label: "Products" },
  { key: "categories", label: "Categories" },
  { key: "users", label: "Users" },
  { key: "orders", label: "Orders" },
];

function ProductsTab({ onNotify }) {
  const [products, setProducts] = useState([]);
  const [editing, setEditing] = useState(null);
  const { categories, loading: categoriesLoading } = useCategories();
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

  const fetchProducts = async () => {
    try {
      const res = await fetch(`${API_URL}/api/v1/users/products`);
      const data = await res.json();
      if (res.ok && data.data) {
        setProducts(data.data.products);
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

    formData.forEach((value, key) => {
      console.log(key, value);
    });

    try {
      const res = await fetch(`${API_URL}/api/v1/admin/products/create`, {
        method: "POST",
        body: formData,
        credentials: "include",
      });
      const data = await res.json();
      if (res.ok) {
        onNotify && onNotify(data.message, "success");
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
      } else throw new Error(data.message || "Failed");
    } catch (err) {
      onNotify && onNotify(err.message || "Create failed", "error");
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this product?")) return;
    try {
      const res = await fetch(`${API_URL}/api/v1/admin/products/delete/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      const data = await res.json();
      if (res.ok) {
        onNotify && onNotify(data.message, "success");
        fetchProducts();
      } else throw new Error(data.message || "Delete failed");
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
    formData.append("price", form.price);
    formData.append("stock", form.stock);

    form.newImages.forEach((img) => {
      formData.append("images", img.file);
    });

    try {
      const res = await fetch(
        `${API_URL}/api/v1/admin/products/update/${editing}`,
        {
          method: "PATCH",
          body: formData,
          credentials: "include",
        },
      );

      const data = await res.json();
      if (res.ok) {
        onNotify && onNotify(data.message, "success");
        setEditing(null);
        fetchProducts();
      } else throw new Error(data.message || "Update failed");
    } catch (err) {
      onNotify && onNotify(err.message || "Update failed", "error");
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
                <MenuItem key={cat._id} value={cat._id}>
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
            <Button variant="contained" onClick={handleCreate}>
              Create Product
            </Button>
          ) : (
            <>
              <Button variant="contained" onClick={handleUpdate}>
                Save
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

      <Paper elevation={1} sx={{ p: 2 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Price</TableCell>
              <TableCell>Stock</TableCell>
              <TableCell>Category</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {products.map((p) => (
              <TableRow key={p._id} hover>
                <TableCell>{p.name}</TableCell>
                <TableCell>{p.price}</TableCell>
                <TableCell>{p.stock}</TableCell>
                <TableCell>{p.category}</TableCell>
                <TableCell>
                  <IconButton onClick={() => startEdit(p)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={() => handleDelete(p._id)} color="error">
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
    </Box>
  );
}

function CategoriesTab({ onNotify }) {
  const { categories, loading: categoriesLoading } = useCategories();
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

    try {
      const res = await fetch(`${API_URL}/api/v1/admin/category/create`, {
        method: "POST",
        body: formData,
        credentials: "include",
      });
      const data = await res.json();
      if (res.ok) {
        onNotify && onNotify(data.message, "success");
        setForm({ name: "", image: null, preview: null });
        fetchCategories();
      } else throw new Error(data.message || "Failed");
    } catch (err) {
      onNotify && onNotify(err.message || "Create failed", "error");
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this category?")) return;
    try {
      const res = await fetch(`${API_URL}/api/v1/admin/category/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      const data = await res.json();
      if (res.ok) {
        onNotify && onNotify(data.message, "success");
        fetchCategories();
      } else throw new Error(data.message || "Delete failed");
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

    try {
      const res = await fetch(
        `${API_URL}/api/v1/admin/category/edit/${editing}`,
        {
          method: "PATCH",
          body: formData,
          credentials: "include",
        },
      );
      const data = await res.json();
      if (res.ok) {
        onNotify && onNotify(data.message, "success");
        setEditing(null);
        setForm({ name: "", image: null, preview: null });
        fetchCategories();
      } else throw new Error(data.message || "Update failed");
    } catch (err) {
      onNotify && onNotify(err.message || "Update failed", "error");
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
            <Button variant="contained" onClick={handleCreate}>
              Create Category
            </Button>
          ) : (
            <>
              <Button variant="contained" onClick={handleUpdate}>
                Save
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
      const res = await fetch(`${API_URL}/api/v1/admin/user`, {
        method: "GET",
        credentials: "include",
      });
      const data = await res.json();
      if (res.ok) {
        const usersSet = new Set(data.data.map((o) => o));
        setUsers(Array.from(usersSet));
      } else {
        onNotify && onNotify(data.message || "Failed to fetch orders", "error");
      }
    } catch (err) {
      console.error(err);
      onNotify && onNotify("Network error", "error");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchUserUidsFromOrders();
  }, []);

  const handleBan = async (uid) => {
    try {
      const res = await fetch(`${API_URL}/api/v1/admin/ban/${uid}`, {
        method: "POST",
        credentials: "include",
      });
      const data = await res.json();
      if (res.ok) onNotify && onNotify(data.message, "success");
      else throw new Error(data.message || "Failed");
    } catch (err) {
      onNotify && onNotify(err.message || "Ban failed", "error");
    }
  };

  const handleUnban = async (uid) => {
    try {
      const res = await fetch(`${API_URL}/api/v1/admin/unban/${uid}`, {
        method: "POST",
        credentials: "include",
      });
      const data = await res.json();
      if (res.ok) onNotify && onNotify(data.message, "success");
      else throw new Error(data.message || "Failed");
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
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>NAME</TableCell>
                <TableCell>EMAIL</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user._id}>
                  <TableCell>{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <IconButton onClick={() => handleBan(user._uid)}>
                      <BlockIcon />
                    </IconButton>
                    <IconButton onClick={() => handleUnban(user._uid)}>
                      <LockOpenIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </Paper>
    </Box>
  );
}

function OrdersTab({ onNotify }) {
  const [orders, setOrders] = useState([]);

  const fetchOrders = async () => {
    try {
      const res = await fetch(`${API_URL}/api/v1/admin/orders`, {
        credentials: "include",
      });
      const data = await res.json();
      if (res.ok) {
        setOrders(data.data || []);
      } else
        onNotify && onNotify(data.message || "Failed to fetch orders", "error");
    } catch (err) {
      console.error(err);
      onNotify && onNotify("Network error", "error");
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleStatusChange = async (orderId, status) => {
    try {
      const res = await fetch(`${API_URL}/api/v1/admin/order/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ orderStatus: status }),
      });
      const data = await res.json();
      if (res.ok) {
        onNotify && onNotify(data.message, "success");
        fetchOrders();
      } else throw new Error(data.message || "Update failed");
    } catch (err) {
      onNotify && onNotify(err.message || "Update failed", "error");
    }
  };

  return (
    <Box>
      <Paper sx={{ p: 1 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Order ID</TableCell>
              <TableCell>User</TableCell>
              <TableCell>Total</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {orders.map((o) => (
              <TableRow key={o._id} hover>
                <TableCell>{o._id}</TableCell>
                <TableCell>
                  {o.user?.name} ({o.user?.email})
                </TableCell>
                <TableCell>{o.productPrice}</TableCell>
                <TableCell>{o.orderStatus}</TableCell>
                <TableCell>
                  <FormControl size="small" sx={{ minWidth: 140 }}>
                    <InputLabel>Status</InputLabel>
                    <Select
                      label="Status"
                      defaultValue={o.orderStatus}
                      onChange={(e) =>
                        handleStatusChange(o._id, e.target.value)
                      }
                    >
                      <MenuItem value="pending">pending</MenuItem>
                      <MenuItem value="confirmed">confirmed</MenuItem>
                      <MenuItem value="shipped">shipped</MenuItem>
                      <MenuItem value="delivered">delivered</MenuItem>
                      <MenuItem value="cancelled">cancelled</MenuItem>
                      <MenuItem value="returned">returned</MenuItem>
                    </Select>
                  </FormControl>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
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

        <Paper sx={{ mb: 3 }} elevation={2}>
          <Tabs
            value={activeTab}
            onChange={(e, v) => setActiveTab(v)}
            indicatorColor="primary"
            textColor="primary"
            variant="fullWidth"
          >
            {TABS.map((t) => (
              <Tab key={t.key} label={t.label} />
            ))}
          </Tabs>
        </Paper>

        <Box sx={{ mt: 3 }}>
          {activeTab === 0 && <ProductsTab onNotify={onNotify} />}
          {activeTab === 1 && <CategoriesTab onNotify={onNotify} />}
          {activeTab === 2 && <UsersTab onNotify={onNotify} />}
          {activeTab === 3 && <OrdersTab onNotify={onNotify} />}
        </Box>
      </Container>
    </Box>
  );
}
