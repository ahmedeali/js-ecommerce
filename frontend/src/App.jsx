import { useEffect, useState } from 'react'
import { API_BASE } from './api'

function App() {

  const [products, setProducts] = useState([])
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [token, setToken] = useState(localStorage.getItem('token'))
  const [profile, setProfile] = useState(null)
  const [orders, setOrders] = useState([])

  useEffect(() => {
    fetch(`${API_BASE}/api/products`)
      .then(res => res.json())
      .then(data => setProducts(data))
      .catch(err => console.error(err))
  }, [])

  // LOGIN
  const handleLogin = async (e) => {
    e.preventDefault()

    const res = await fetch(`${API_BASE}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    })

    const data = await res.json()

    if (data.token) {
      localStorage.setItem('token', data.token)
      setToken(data.token)
      alert('Login successful')
    } else {
      alert('Login failed')
    }
  }

  // PROFILE
  const loadProfile = async () => {
    const res = await fetch(`${API_BASE}/api/auth/profile`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })

    const data = await res.json()
    setProfile(data)
  }

  // LOGOUT
  const logout = () => {
    localStorage.removeItem('token')
    setToken(null)
    setProfile(null)
    setOrders([])
  }

  // CREATE ORDER
  const createOrder = async (product) => {

    const quantity = product.quantity || 1

    const res = await fetch(`${API_BASE}/api/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({
        orderItems: [
          {
            name: product.name,
            qty: quantity,
            price: product.price,
            product: product._id
          }
        ]
      })
    })

    const data = await res.json()

    if (res.ok) {
      alert('Order created successfully')
      window.location.reload()
    } else {
      alert(data.message)
    }
  }

  // FETCH ORDERS
  const fetchOrders = async () => {
    const res = await fetch(`${API_BASE}/api/orders/my`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })

    const data = await res.json()

    if (res.ok) {
      setOrders(data)
    } else {
      alert(data.message)
    }
  }

  return (
    <div style={{ padding: '40px', fontFamily: 'Arial' }}>

      <h1>JS E-Commerce</h1>

      {!token ? (
        <form onSubmit={handleLogin} style={{ marginBottom: '30px' }}>
          <h2>Login</h2>

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            style={{ display: 'block', marginBottom: '10px' }}
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            style={{ display: 'block', marginBottom: '10px' }}
          />

          <button type="submit">Login</button>

        </form>
      ) : (
        <div style={{ marginBottom: '30px' }}>

          <button onClick={loadProfile}>Load Profile</button>

          <button onClick={fetchOrders} style={{ marginLeft: '10px' }}>
            Load My Orders
          </button>

          <button onClick={logout} style={{ marginLeft: '10px' }}>
            Logout
          </button>

          {profile && (
            <div style={{ marginTop: '15px' }}>
              <h3>Profile</h3>
              <pre>{JSON.stringify(profile, null, 2)}</pre>
            </div>
          )}
        </div>
      )}

      <h2>Products</h2>

      {products.map(product => (
        <div
          key={product._id}
          style={{
            border: '1px solid #ccc',
            padding: '15px',
            marginBottom: '10px',
            borderRadius: '6px'
          }}
        >
          <h3>{product.name}</h3>
          <p>{product.description}</p>
          <p>Price: {product.price}</p>
          <p>Stock: {product.stock}</p>

          {token && (
            <>
              <input
                type="number"
                min="1"
                max={product.stock}
                placeholder="Qty"
                onChange={(e) =>
                  product.quantity = Number(e.target.value)
                }
                style={{ marginRight: '10px', width: '60px' }}
              />

              <button onClick={() => createOrder(product)}>
                Buy
              </button>
            </>
          )}
        </div>
      ))}

      {orders.length > 0 && (
        <div style={{ marginTop: '40px' }}>
          <h2>My Orders</h2>

          {orders.map(order => (
            <div
              key={order._id}
              style={{
                border: '1px solid #999',
                padding: '15px',
                marginBottom: '10px',
                borderRadius: '6px'
              }}
            >
              <p><strong>Order ID:</strong> {order._id}</p>
              <p><strong>Status:</strong> {order.status}</p>
              <p><strong>Total:</strong> {order.totalPrice}</p>

              <div>
                <strong>Items:</strong>
                {order.orderItems.map((item, index) => (
                  <div key={index}>
                    {item.name} — Qty: {item.qty}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  )
}

export default App