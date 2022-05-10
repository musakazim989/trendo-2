import {useContext, useEffect,useReducer} from 'react'
import { Col, Container, Row,Card,Badge,Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import Rating from './Rating.jsx';
import axios from 'axios'
import { Helmet } from 'react-helmet-async'
import { Store } from '../Store.js';


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

const ProductPage = () => {

    const [{loading,product,error}, dispatch] = useReducer(reducer,{
        loading: false,
        product: [],
        error: '',
    });
    useEffect(()=>{
        async function fetchData() {
            dispatch({type: 'FETCH_REQUEST'})
            try{
                let product = await axios.get('http://localhost:8000/products')
                dispatch({type: 'FETCH_SUCCESS', payload: product.data})
            }catch(err){
                dispatch({type: 'FETCH_FAILS', payload: err.message})
            }
        }
        fetchData();
    },[])

    const {state, dispatch: ctxDispatch} = useContext(Store)
    const {cart} = state 

    let handleAddToCart = async (product) =>{
        const existingItem = cart.cartItems.find((item)=>item._id === product._id)
        const quantity = existingItem ? existingItem.quantity + 1 : 1
        
        const {data} = await axios.get(`http://localhost:8000/cartproduct/${product._id}`)
        // console.log(data); 
        // if(data.instock < quantity){
        //   window.alert(`${product.name} out of stock`)
        //   return
        // }
       
        ctxDispatch({
          type: 'CART_ADD_ITEMS',
          payload: {...product, quantity}
        })
    }

    

  return (
    <Container>
        <Helmet>
            <title>
                Product Page
            </title>
        </Helmet>
        <Row>
            {product.map((item)=>(
                <Col lg={3}>
                <Card style={{height: 600}}>
                    <Card.Img variant="top" src={item.image} />
                    <Card.Body className='py-0'
                        style={{height: 40}}
                    >
                        <Card.Title className='mt-3 '>
                            <Link to={`/products/${item.slug}`}>
                                <h4 className='title'>{item.title}</h4> {' '}
                            </Link>
                        </Card.Title>
                        <h5 className='model'>
                            {item.model}
                        </h5>
                        <Card.Text>
                            <Rating 
                                rating={item.rating} 
                                numberofrating={item.numberofrating} 
                            />
                        </Card.Text>
                        <Card.Text className='subDetails'>
                            {item.subdescription}
                        </Card.Text>
                    
                        <Card.Text className='py-0'>
                            <h5 className='price'>
                                ${item.price}
                            </h5>
                        </Card.Text>
                    </Card.Body>
                    <Card.Body style={{marginTop: 30}}>
                        {item.instock == 0
                        ?
                            <Button 
                                className='mt-1 w-100'
                                variant="danger"
                                >
                                Out of Stock
                            </Button>
                        :
                            <Button 
                                className='mt-1 w-100' /* video no: 18 */
                                onClick={()=> handleAddToCart(item)} /* video no: 16 cpy from pro.details*/
                                variant="info"
                                >
                                Add to Card
                            </Button>
                        }
                    </Card.Body>
                </Card>
            </Col>
            ))}
        </Row>
    </Container>
  )
}

export default ProductPage