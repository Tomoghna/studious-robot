import React, { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useSnackbar } from "../contexts/SnackbarContext";
import LoginForm from "../components/LoginForm";
import { Box, Tabs, Tab, Typography, Avatar, Button, Grid, TextField, MenuItem, Card, CardContent, CardActions } from '@mui/material';

const API_URL = "http://localhost:8000";

function TabPanel({ children, value, index }) {
  return (
    <div role="tabpanel" hidden={value !== index}>
      {value === index && <Box sx={{ py: 2 }}>{children}</Box>}
    </div>
  );
}

const STATES = [
  { name: "Maharashtra", cities: ["Mumbai", "Pune", "Nagpur"] },
  { name: "Delhi", cities: ["New Delhi", "Dwarka", "Rohini"] },
  { name: "Karnataka", cities: ["Bengaluru", "Mysuru", "Mangalore"] },
];

const LoginPage = () => {
  const { user, fetchUser } = useAuth();
  const { showSnackbar } = useSnackbar();
  const [tabIndex, setTabIndex] = useState(0);
  const [formChanged, setFormChanged] = useState(false);

  // local account state
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');

  // addresses
  const initialForm = { fullName: '', phone: '', email: '', pin: '', address1: '', address2: '', state: '', city: '' };
  const [addresses, setAddresses] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [adding, setAdding] = useState(false);
  const [editingId, setEditingId] = useState(null);

  // orders
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setEmail(user.email || '');
      setPhone(user.phone || '');
      setAddresses(user.address || []);
      loadOrders();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const handleTab = (e, v) => setTabIndex(v);

  const loadOrders = async () => {
    try {
      const res = await fetch(`${API_URL}/api/v1/users/orders`, { credentials: 'include' });
      const data = await res.json();
      if (res.ok) setOrders(data.orders || []);
      else showSnackbar(data.message || 'Failed to fetch orders', 'error');
    } catch (err) { console.error(err); showSnackbar('Network error', 'error'); }
  };

  const handleProfileSave = async () => {
    try {
      const res = await fetch(`${API_URL}/api/v1/users/updateprofile`, {
        method: 'PATCH', credentials: 'include', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, newAddress: '', phone })
      });
      const data = await res.json();
      if (res.ok) {
        showSnackbar('Profile updated', 'success');
        await fetchUser();
        setFormChanged(false);
      } else showSnackbar(data.message || 'Update failed', 'error');
    } catch (err) { console.error(err); showSnackbar('Network error', 'error'); }
  };

  const handleInput = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    setFormChanged(true);
  };

  const handleStateChange = (e) => {
    setForm(prev => ({ ...prev, state: e.target.value, city: '' }));
    setFormChanged(true);
  };

  const handleAddAddress = async () => {
    const ok = form.fullName && form.address1 && form.state && form.city && form.pin && form.phone && form.email;
    if (!ok) return showSnackbar('Please fill all address fields', 'warning');
    try {
      const res = await fetch(`${API_URL}/api/v1/users/updateprofile`, {
        method: 'PATCH', credentials: 'include', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: user.name || '', newAddress: {
          street: form.address1 + (form.address2 ? '\n' + form.address2 : ''), city: form.city, state: form.state, zip: form.pin, defaultAddress: false
        }, phone: user.phone || '' })
      });
      const data = await res.json();
      if (res.ok) {
        showSnackbar('Address added', 'success');
        await fetchUser();
        setForm(initialForm); setAdding(false);
      } else showSnackbar(data.message || 'Failed to add address', 'error');
    } catch (err) { console.error(err); showSnackbar('Network error', 'error'); }
  };

  const startEdit = (addr) => {
    setEditingId(addr._id || addr.id);
    const [a1, a2] = (addr.street || '').split('\n');
    setForm({ fullName: addr.fullName || user.name || '', phone: addr.phone || '', email: addr.email || user.email || '', pin: addr.zip || '', address1: a1 || '', address2: a2 || '', state: addr.state || '', city: addr.city || '' });
    setAdding(true);
  };

  const handleSaveEdit = async () => {
    if (!editingId) return;
    try {
      const res = await fetch(`${API_URL}/api/v1/users/updateaddress/${editingId}`, {
        method: 'PATCH', credentials: 'include', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ address: { street: form.address1 + (form.address2 ? '\n' + form.address2 : ''), city: form.city, state: form.state, zip: form.pin } })
      });
      const data = await res.json();
      if (res.ok) { showSnackbar('Address updated', 'success'); await fetchUser(); setEditingId(null); setAdding(false); setForm(initialForm); }
      else showSnackbar(data.message || 'Update failed', 'error');
    } catch (err) { console.error(err); showSnackbar('Network error', 'error'); }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this address?')) return;
    try {
      const res = await fetch(`${API_URL}/api/v1/users/deleteaddress/${id}`, { method: 'DELETE', credentials: 'include' });
      const data = await res.json();
      if (res.ok) { showSnackbar('Address deleted', 'success'); await fetchUser(); }
      else showSnackbar(data.message || 'Delete failed', 'error');
    } catch (err) { console.error(err); showSnackbar('Network error', 'error'); }
  };

  const handleCancelEdit = () => { setEditingId(null); setAdding(false); setForm(initialForm); }

  const handleCancelOrder = async (orderId) => {
    if (!confirm('Cancel this order?')) return;
    try {
      const res = await fetch(`${API_URL}/api/v1/users/orders/cancel/${orderId}`, { method: 'PATCH', credentials: 'include' });
      const data = await res.json();
      if (res.ok) { showSnackbar('Order cancelled', 'success'); loadOrders(); }
      else showSnackbar(data.message || 'Cancel failed', 'error');
    } catch (err) { console.error(err); showSnackbar('Network error', 'error'); }
  };

  if (!user) {
    return (
      <Box sx={{ maxWidth: 640, mx: 'auto', px: 2, py: 6 }}>
        <Typography variant="h5" gutterBottom>Login</Typography>
        <Typography gutterBottom>Please log in to manage your account, addresses and orders.</Typography>
        <Box sx={{ mt: 3 }}><LoginForm /></Box>
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 960, mx: 'auto', px: 2, py: 4 }}>
      <Typography variant="h5" gutterBottom>Account Management</Typography>
      <Card variant="outlined">
        <CardContent>
          <Tabs value={tabIndex} onChange={handleTab} aria-label="account tabs">
            <Tab label="Account Info" />
            <Tab label="Manage Addresses" />
            <Tab label="Orders" />
          </Tabs>

          <TabPanel value={tabIndex} index={0}>
            <Grid container spacing={2} alignItems="center">
              <Grid item>
                <Avatar sx={{ width: 72, height: 72 }}>{(user.name || 'U')[0]}</Avatar>
              </Grid>
              <Grid item xs>
                <TextField label="Name" fullWidth value={name} onChange={e => { setName(e.target.value); setFormChanged(true); }} sx={{ mb: 1 }} />
                <TextField label="Email" fullWidth value={email} onChange={e => { setEmail(e.target.value); setFormChanged(true); }} sx={{ mb: 1 }} />
                <TextField label="Phone" fullWidth value={phone} onChange={e => { setPhone(e.target.value); setFormChanged(true); }} sx={{ mb: 1 }} />
                <Box sx={{ mt: 1 }}>
                  <Button variant="contained" onClick={handleProfileSave} disabled={!formChanged}>Save Profile</Button>
                </Box>
              </Grid>
            </Grid>
          </TabPanel>

          <TabPanel value={tabIndex} index={1}>
            <Box sx={{ mb: 2 }}>
              <Grid container spacing={2}>
                {addresses.map(addr => (
                  <Grid item xs={12} md={6} key={addr._id || addr.id}>
                    <Card variant="outlined">
                      <CardContent>
                        <Typography fontWeight={600}>{addr.fullName || user.name}</Typography>
                        <Typography>{(addr.street || addr.address1 || '')}</Typography>
                        {addr.address2 && <Typography>{addr.address2}</Typography>}
                        <Typography>{addr.city}, {addr.state} - {addr.zip || addr.pin}</Typography>
                        <Typography>Phone: {addr.phone}</Typography>
                        <Typography>Email: {addr.email || user.email}</Typography>
                      </CardContent>
                      <CardActions>
                        <Button size="small" onClick={() => startEdit(addr)}>Edit</Button>
                        <Button size="small" color="error" onClick={() => handleDelete(addr._id || addr.id)}>Delete</Button>
                      </CardActions>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </Box>

            {!adding && (
              <Button variant="contained" onClick={() => { setAdding(true); setEditingId(null); }}>Add New Address</Button>
            )}

            {adding && (
              <Box sx={{ mt: 2, p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 1 }}>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={6}><TextField label="Full Name" name="fullName" fullWidth value={form.fullName} onChange={handleInput} /></Grid>
                  <Grid item xs={12} md={6}><TextField label="Phone" name="phone" fullWidth value={form.phone} onChange={handleInput} /></Grid>
                  <Grid item xs={12} md={6}><TextField label="Email" name="email" fullWidth value={form.email} onChange={handleInput} /></Grid>
                  <Grid item xs={12} md={6}><TextField label="Pin Code" name="pin" fullWidth value={form.pin} onChange={handleInput} /></Grid>
                  <Grid item xs={12}><TextField label="Address Line 1" name="address1" fullWidth value={form.address1} onChange={handleInput} /></Grid>
                  <Grid item xs={12}><TextField label="Address Line 2" name="address2" fullWidth value={form.address2} onChange={handleInput} /></Grid>
                  <Grid item xs={12} md={6}>
                    <TextField select label="State" name="state" fullWidth value={form.state} onChange={handleStateChange}>
                      <MenuItem value="">Select State</MenuItem>
                      {STATES.map(s => <MenuItem key={s.name} value={s.name}>{s.name}</MenuItem>)}
                    </TextField>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField select label="City" name="city" fullWidth value={form.city} onChange={handleInput} disabled={!form.state}>
                      <MenuItem value="">Select City</MenuItem>
                      {(STATES.find(s => s.name === form.state)?.cities || []).map(c => <MenuItem key={c} value={c}>{c}</MenuItem>)}
                    </TextField>
                  </Grid>
                </Grid>
                <Box sx={{ mt: 2 }}>
                  {editingId ? (
                    <>
                      <Button variant="contained" onClick={handleSaveEdit} sx={{ mr: 1 }}>Save Changes</Button>
                      <Button onClick={handleCancelEdit}>Cancel</Button>
                    </>
                  ) : (
                    <Button variant="contained" onClick={handleAddAddress}>Save Address</Button>
                  )}
                </Box>
              </Box>
            )}
          </TabPanel>

          <TabPanel value={tabIndex} index={2}>
            <Typography variant="h6" gutterBottom>Your Orders</Typography>
            <Grid container spacing={2}>
              {orders.map(o => (
                <Grid item xs={12} md={6} key={o._id || o.id}>
                  <Card variant="outlined">
                    <CardContent>
                      <Typography fontWeight={600}>Order #{o._id || o.id}</Typography>
                      <Typography>Status: {o.status}</Typography>
                      <Typography>Items: {o.items?.map(i => i.name).join(', ') || o.items}</Typography>
                    </CardContent>
                    <CardActions>
                      <Button size="small" onClick={() => setSelectedOrder(o)}>View</Button>
                      <Button size="small" onClick={() => { /* Ideally navigate to track page or show map */ setSelectedOrder(o); }}>Track</Button>
                      {o.status !== 'Cancelled' && <Button size="small" color="error" onClick={() => handleCancelOrder(o._id || o.id)}>Cancel</Button>}
                    </CardActions>
                  </Card>
                </Grid>
              ))}
            </Grid>

            {selectedOrder && (
              <Box sx={{ mt: 2, p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 1 }}>
                <Typography variant="h6">Order Details</Typography>
                <Typography>Order ID: {selectedOrder._id || selectedOrder.id}</Typography>
                <Typography>Status: {selectedOrder.status}</Typography>
                <Typography>Amount: {selectedOrder.amount || selectedOrder.total}</Typography>
                <Typography>Items: {(selectedOrder.items || []).map(it => it.name).join(', ')}</Typography>
                <Box sx={{ mt: 1 }}>
                  <Button onClick={() => setSelectedOrder(null)}>Close</Button>
                </Box>
              </Box>
            )}
          </TabPanel>

        </CardContent>
      </Card>
    </Box>
  );
};

export default LoginPage;