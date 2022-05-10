import { useState } from "react";
import { Navbar, Container, Nav, Badge,NavDropdown,Button,Offcanvas, NavItem } from "react-bootstrap";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Link } from "react-router-dom";
import { useContext } from "react";
import { Store } from "./Store";
import ProductPage from "./components/ProductPage";
import HomePage from "./components/HomePage";
import ProductDetails from "./components/ProductDetails";
import CartPage from "./components/CartPage";



function App() {

  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const {state,dispatch} = useContext(Store)

  const {cart: {cartItems}} = state


  let updateCart = (item,quantity)=>{
    dispatch({
      type: 'CART_ADD_ITEMS', 
      payload: {...item,quantity}
    })
  }
    
  let handleRemoveItem = (item)=>{ 
    dispatch({
      type: 'CART_REMOVE_ITEMS', 
      payload: item  
    })
  }




  return (
    <BrowserRouter>
        <Navbar bg="dark" variant="dark">
          <Container>
            <Navbar.Brand href="#home">Amazon</Navbar.Brand>
            <Nav className="ms-auto menu">
              <Link className="item" to="/">Home</Link>
              <Link className="item" to="/products">Products</Link>
              <Link className="item" to="/compare">Compare Products</Link>
              
             
              <NavDropdown title="Cart" id="basic-nav-dropdown">
                {cartItems.map((item)=>(
                  <>
                    <img className="me-2 mt-2" width="50" src={item.image}></img>
                    <Link className="me-2" to={`/products/${item.slug}`}> {/*Copy from cartPage*/}
                      {item.title}
                    </Link>
                    <Button 
                      className="me-2 mt-2"
                      onClick={()=> updateCart(item,item.quantity+1)} 
                      disabled={item.quantity == item.instock} 
                      variant="success">
                      +
                    </Button>

                    <span className="me-2 mt-2">
                      {item.quantity}
                    </span>

                    <Button 
                      className="me-2 mt-2"
                      onClick={()=> updateCart(item,item.quantity-1)} 
                      disabled={item.quantity === 1}
                      variant="success">
                      -
                    </Button>
                    <Button 
                      className="me-2 mt-2"
                      onClick={()=>handleRemoveItem(item)}
                      variant="danger">
                      Delete
                    </Button>
                    <NavDropdown.Divider />
                    <br/>
                  </>
                ))}
                <div>
                  <Link to="/cartpage">
                    <Button
                      className="w-100" 
                      variant="info">
                      Go to Cart
                    </Button>
                  </Link>
                </div>
              </NavDropdown>

              {state.cart.cartItems.length > 0 && (
                <Badge pill bg="info">
                  {state.cart.cartItems.length}
                </Badge>
              )}
            </Nav>
          </Container>
        </Navbar>

        <Button variant="primary" onClick={handleShow} className="me-2 sidebar">
          Cart
        </Button>

        <Offcanvas 
          show={show} 
          onHide={handleClose} 
          placement="end"   /* ete nije theke add korte hbe */
          >
          <Offcanvas.Header closeButton>
            <Offcanvas.Title>Offcanvas</Offcanvas.Title>
          </Offcanvas.Header>
          <Offcanvas.Body>
            {cartItems.map((item)=>(
              <>
                <img className="me-2 mt-2" width="50" src={item.image}></img>
                <Link className="me-2" to={`/products/${item.slug}`}>
                  {item.title}
                </Link>
                <Button 
                  className="me-2 mt-2"
                  onClick={()=> updateCart(item,item.quantity+1)} 
                  disabled={item.quantity == item.instock} 
                  variant="success">
                  +
                </Button>

                <span className="me-2 mt-2">
                  {item.quantity}
                </span>

                <Button 
                  className="me-2 mt-2"
                  onClick={()=> updateCart(item,item.quantity-1)} 
                  disabled={item.quantity === 1}
                  variant="success">
                  -
                </Button>
                <Button 
                  className="me-2 mt-2"
                  onClick={()=>handleRemoveItem(item)}
                  variant="danger">
                  Delete
                </Button>
                <hr/>
                <br></br>
              </>
            ))}

            <div>
              <Button
                className="w-100" 
                variant="info">

                <Link to="/cartpage">
                  Go to Cart
                </Link>
              </Button>
            </div>
          </Offcanvas.Body>
        </Offcanvas>

        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/products" element={<ProductPage />} />
          <Route path="/products/:slug" element={<ProductDetails />} />
          <Route path="/cartpage" element={<CartPage />} />
          
        </Routes>
      </BrowserRouter>
  );
}

export default App;
