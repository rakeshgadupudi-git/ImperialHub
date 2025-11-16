import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './EditProduct.css';
//fectching the details of product
export default function EditProduct({ user }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    longDescription: '',
    price: '',
    originalPrice: '',
    category: 'Electronics',
    brand: '',
    inStock: true,
    stockQuantity: '',
    condition: 'New',
    tags: '',
    specifications: {}
  });
  const [images, setImages] = useState([]);
  const [newImageUrl, setNewImageUrl] = useState('');

  useEffect(() => {
    if (!user) {
      alert('Please login to edit products');
      navigate('/shop');
      return;
    }
    fetchProduct();
  }, [id, user]);

  const fetchProduct = async () => {
    try {
      const response = await fetch(`/api/products/${id}`);
      if (response.ok) {
        const data = await response.json();
        // Check if user is the seller
        if (data.seller && data.seller.toString() !== user.id) {
          alert('You are not authorized to edit this product');
          navigate('/shop');
          return;
        }
        setProduct(data);
        setFormData({
          name: data.name || '',
          description: data.description || '',
          longDescription: data.longDescription || '',
          price: data.price || '',
          originalPrice: data.originalPrice || '',
          category: data.category || 'Electronics',
          brand: data.brand || '',
          inStock: data.inStock !== undefined ? data.inStock : true,
          stockQuantity: data.stockQuantity || '',
          condition: data.condition || 'New',
          tags: data.tags ? data.tags.join(', ') : '',
          specifications: data.specifications || {}
        });
        setImages(data.images && data.images.length > 0 ? data.images : [data.image].filter(Boolean));
      } else {
        alert('Product not found');
        navigate('/shop');
      }
    } catch (err) {
      console.error('Error fetching product:', err);
      alert('Failed to load product');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const tagsArray = formData.tags.split(',').map(tag => tag.trim()).filter(Boolean);
      const updateData = {
        ...formData,
        price: parseFloat(formData.price),
        originalPrice: formData.originalPrice ? parseFloat(formData.originalPrice) : undefined,
        stockQuantity: parseInt(formData.stockQuantity) || 0,
        tags: tagsArray,
        images: images.length > 0 ? images : [formData.image].filter(Boolean)
      };

      const response = await fetch(`/api/products/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData),
      });

      if (response.ok) {
        alert('Product updated successfully!');
        navigate(`/product/${product.slug || id}`);
      } else {
        alert('Failed to update product');
      }
    } catch (err) {
      console.error('Error updating product:', err);
      alert('Failed to update product');
    }
  };

  const addImage = () => {
    if (newImageUrl.trim() && !images.includes(newImageUrl.trim())) {
      setImages([...images, newImageUrl.trim()]);
      setNewImageUrl('');
    }
  };

  const removeImage = (index) => {
    setImages(images.filter((_, i) => i !== index));
  };

  if (loading) {
    return (
      <div className="edit-product-page">
        <div className="loading">Loading product...</div>
      </div>
    );
  }

  return (
    <div className="edit-product-page">
      <div className="edit-product-container">
        <h1>Edit Product</h1>
        <form onSubmit={handleSubmit} className="edit-product-form">
          <div className="form-row">
            <div className="form-group">
              <label>Product Name *</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label>Category *</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                required
              >
                <option value="Electronics">Electronics</option>
                <option value="Fashion">Fashion</option>
                <option value="Accessories">Accessories</option>
                <option value="Home">Home</option>
                <option value="Sports">Sports</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label>Short Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows="3"
            />
          </div>

          <div className="form-group">
            <label>Long Description</label>
            <textarea
              value={formData.longDescription}
              onChange={(e) => setFormData({ ...formData, longDescription: e.target.value })}
              rows="5"
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Price (₹) *</label>
              <input
                type="number"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                required
                min="0"
                step="0.01"
              />
            </div>
            <div className="form-group">
              <label>Original Price (₹)</label>
              <input
                type="number"
                value={formData.originalPrice}
                onChange={(e) => setFormData({ ...formData, originalPrice: e.target.value })}
                min="0"
                step="0.01"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Brand</label>
              <input
                type="text"
                value={formData.brand}
                onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label>Condition</label>
              <select
                value={formData.condition}
                onChange={(e) => setFormData({ ...formData, condition: e.target.value })}
              >
                <option value="New">New</option>
                <option value="Like New">Like New</option>
                <option value="Excellent">Excellent</option>
                <option value="Good">Good</option>
                <option value="Fair">Fair</option>
                <option value="Poor">Poor</option>
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>In Stock</label>
              <input
                type="checkbox"
                checked={formData.inStock}
                onChange={(e) => setFormData({ ...formData, inStock: e.target.checked })}
              />
            </div>
            <div className="form-group">
              <label>Stock Quantity</label>
              <input
                type="number"
                value={formData.stockQuantity}
                onChange={(e) => setFormData({ ...formData, stockQuantity: e.target.value })}
                min="0"
              />
            </div>
          </div>

          <div className="form-group">
            <label>Tags (comma-separated)</label>
            <input
              type="text"
              value={formData.tags}
              onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
              placeholder="premium, modern, stylish"
            />
          </div>

          <div className="form-group">
            <label>Product Images</label>
            <div className="images-section">
              {images.map((img, index) => (
                <div key={index} className="image-item">
                  <img src={img} alt={`Product ${index + 1}`} />
                  <button type="button" onClick={() => removeImage(index)}>Remove</button>
                </div>
              ))}
              <div className="add-image">
                <input
                  type="text"
                  value={newImageUrl}
                  onChange={(e) => setNewImageUrl(e.target.value)}
                  placeholder="Image URL"
                />
                <button type="button" onClick={addImage}>Add Image</button>
              </div>
            </div>
          </div>

          <div className="form-actions">
            <button type="button" onClick={() => navigate(-1)} className="cancel-btn">
              Cancel
            </button>
            <button type="submit" className="save-btn">
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}


