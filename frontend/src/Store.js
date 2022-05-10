import { createContext, useReducer } from "react";

const Store = createContext();

const initialState = {
  cart: {
    cartItems: localStorage.getItem("cartItems") 
    ? JSON.parse(localStorage.getItem("cartItems")) 
    : [] /* class 47 */
  },
};

function reducer(state, action) {
  switch (action.type) {
    case "CART_ADD_ITEMS":
    /* class 46 */
    const newItem = action.payload;
    // console.log(newItem);
    const existingItem = state.cart.cartItems.find((item) => item._id === newItem._id);
    const cartItems = existingItem 
    ? state.cart.cartItems.map((item) =>item._id === existingItem._id 
      ? newItem 
      : item)
    : [...state.cart.cartItems, newItem];

    localStorage.setItem("cartItems",JSON.stringify(cartItems)) /* class 47 */

    // console.log(cartItems);
    return { 
      ...state, 
      cart: {
        ...state.cart,cartItems
      } 
    };
    /* class 46 */

    {/* class 47 */}

    case 'CLEAR_CART':{    /* Vedio 45 */
      return { 
        ...state, 
        cart: { 
          ...state.cart, cartItems: []
        } 
      }; 
    }


    case "CART_REMOVE_ITEMS":{      /* Cart delete Part */
      const cartItems = state.cart.cartItems.filter((item)=> item._id !== action.payload._id)

      localStorage.setItem("cartItems",JSON.stringify(cartItems)) /* class 47 */

      return { 
        ...state, 
        cart: { 
          ...state.cart,cartItems
        } 
      };
    }
    {/* class 47 */}
    default:
    return state;
  }
}



function StoreProvider(props) {
  const [state, dispatch] = useReducer(reducer, initialState);


  const value = { state,dispatch,}
  return <Store.Provider value={value}>
    {props.children}
  </Store.Provider>;
}

export { Store, StoreProvider };

 