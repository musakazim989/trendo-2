import { useState,useReducer,useEffect,useContext } from 'react';
import { useParams,Link } from "react-router-dom";
import {Container,Card,Col,Row,ListGroup,Badge,Button,Alert,Form } from 'react-bootstrap';
import axios from 'axios'
import Rating from './Rating';
import { Store } from '../Store';
import { Helmet } from 'react-helmet-async'


function reducer(state, action) {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return {...state, loading:true};
    case 'FETCH_SUCCESS':
      return {...state, loading:false, product:action.payload};
    case 'FETCH_FAILS':
      return {...state, loading:false, error:action.payload};
    default:
      return true
  }
}

const ProductDetails = () => {
  let params = useParams();

  const [cuponText, setCuponText] = useState("") /* Class-50 */
  const [errcupon, setErrcupon] = useState("") /* Class-50 */
  const [afterdiscountprice, setAfterdiscountprice] = useState("")

  const [{loading,product,error}, dispatch] = useReducer(reducer,{
    loading: false,
    product: {},
    error: '',
  });

  useEffect(()=>{
    async function fetchData() {
      dispatch({type: 'FETCH_REQUEST'})
      try{
        let product = await axios.get(`http://localhost:8000/products/${params.slug}`)
        // console.log(product.data);
        dispatch({type: 'FETCH_SUCCESS', payload: product.data})
        
      }catch(err){
        dispatch({type: 'FETCH_FAILS', payload: err.message})
      }
    }
    fetchData();
  },[params.slug])

  const {state, dispatch: ctxDispatch} = useContext(Store)

  const {cart} = state /* class 46 */

  let handleAddToCart = async () =>{
    const existingItem = cart.cartItems.find((item)=>item._id === product._id)
    const quantity = existingItem ? existingItem.quantity + 1 : 1
    
    const {data} = await axios.get(`http://localhost:8000/cartproduct/${product._id}`) 
    console.log(data);
    // if(data.instock < quantity){
    //   window.alert(`${product.name} out of stock`)
    //   return
    // } 
    ctxDispatch({
      type: 'CART_ADD_ITEMS',
      payload: 
      {...product,quantity}
    })
  }

  let handleCuponText = (e) =>{
    setCuponText(e.target.value);
  }

  let handleCupon = () =>{
    console.log(product)
    // console.log(cuponText)
    if(product.cupon !== ""){
      if(product.cupon == cuponText){
        // console.log((product.price * product.discount) / 100 );
        let discountprice = (product.price * product.discount) / 100
        let afterdiscountprice = product.price - discountprice
        
        if(afterdiscountprice < product.discountlimit){
          setErrcupon("For This price Discount not Applicable")
        }else{
          setAfterdiscountprice(afterdiscountprice);
        }
        
      }else{
        setErrcupon("Wrong Cupon Code");
      }
    }else{
      setErrcupon("not allow any cupon for this product")
    }
  }

  

  return (
    <Container>
      <Helmet>
        <title>
          {product.title}
        </title>
      </Helmet>
      <Row className='mt-3'>
        {product ?
          <>
            <Col lg={6}>
              {/* <img src={product.img} alt={product.name} /> */}
              {/* {product.img &&
                <ReactImageZoom {...props} />
              } */}
              <img className='w-50' src={product.image} alt={product.name} /> 
            </Col>

            <Col lg={3}>
            <Card style={{ width: '18rem' }}>
              <ListGroup variant="flush">
                <ListGroup.Item>
                  <h1>
                    {product.title} 
                  </h1>
                </ListGroup.Item>

                <ListGroup.Item>
                  <Rating 
                    rating={product.rating} 
                    numberofrating={product.numberofrating} 
                  />
                </ListGroup.Item>

                <ListGroup.Item>
                  {product.instock>0 ?
                    <h6>
                    Stock <Badge bg="success">{product.instock}</Badge>
                    </h6>
                    :
                    <h6>
                      Stock <Badge bg="danger">{product.instock}</Badge>
                    </h6>
                  }

                  <h4 className='price'>${product.price}</h4>
                </ListGroup.Item>

                <ListGroup.Item className='subDetails'>
                  {product.description}
                </ListGroup.Item>
              
              </ListGroup>
            </Card>
            </Col>

            <Col lg={3}>
            <ListGroup >
              <ListGroup.Item>
                <h5>
                  {afterdiscountprice
                  ?
                    <>
                      <h3>
                        Price: {''} 
                        <del>
                          ${product.price}
                        </del>
                        {' '}
                        ${afterdiscountprice}
                      </h3>
                    </>
                  :
                    <h3> 
                      Price: $
                      {product.price}
                    </h3>
                  }
                </h5>

                
                {/* Class-50 */}

              </ListGroup.Item>
              
              <ListGroup.Item>
                <Form.Control   
                  onChange={handleCuponText}
                  type="text" 
                  placeholder="Enter email" 
                />

                <Form.Text className="text-muted">
                  {errcupon}
                </Form.Text>
                <br/>

                <Button
                  onClick={handleCupon}
                  variant="info">
                  Apply
                </Button>
                </ListGroup.Item>

                <ListGroup.Item>
                {product.instock == 0
                ?
                  <Button
                    // onClick={handleAddToCart}
                    variant="info">
                    Add to cart
                  </Button>
                :
                  <Link to={"/cartpage"}>
                    <Button
                      className='w-100'
                      onClick={handleAddToCart}
                      variant="info">
                      Add to cart
                    </Button>
                  </Link>
                }
                </ListGroup.Item>

                {/* Class-50 */}
               
              
            </ListGroup>
            </Col>
          </>
          :
          <Alert className='text-center mt-5' variant={"danger"}>
            Product not found pls try another product
          </Alert>
        }
      </Row>
    </Container>
  )
}

export default ProductDetails