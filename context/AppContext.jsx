// 'use client'
// import { productsDummyData, userDummyData } from "@/assets/assets";
// import { useUser } from "@clerk/nextjs";
// import { useRouter } from "next/navigation";
// import { createContext, useContext, useEffect, useState } from "react";

// export const AppContext = createContext();

// export const useAppContext = () => {
//     return useContext(AppContext)
// }

// export const AppContextProvider = (props) => {

//     const currency = process.env.NEXT_PUBLIC_CURRENCY
//     const router = useRouter()

//     const {user}=useUser();

//     const [products, setProducts] = useState([])
//     const [userData, setUserData] = useState(false)
//     const [isSeller, setIsSeller] = useState(true)
//     const [cartItems, setCartItems] = useState({})

//     const fetchProductData = async () => {
//         setProducts(productsDummyData)
//     }

//     const fetchUserData = async () => {
//         setUserData(userDummyData)
//     }

//     const addToCart = async (itemId) => {

//         let cartData = structuredClone(cartItems);
//         if (cartData[itemId]) {
//             cartData[itemId] += 1;
//         }
//         else {
//             cartData[itemId] = 1;
//         }
//         setCartItems(cartData);

//     }

//     const updateCartQuantity = async (itemId, quantity) => {

//         let cartData = structuredClone(cartItems);
//         if (quantity === 0) {
//             delete cartData[itemId];
//         } else {
//             cartData[itemId] = quantity;
//         }
//         setCartItems(cartData)

//     }

//     const getCartCount = () => {
//         let totalCount = 0;
//         for (const items in cartItems) {
//             if (cartItems[items] > 0) {
//                 totalCount += cartItems[items];
//             }
//         }
//         return totalCount;
//     }

//     const getCartAmount = () => {
//         let totalAmount = 0;
//         for (const items in cartItems) {
//             let itemInfo = products.find((product) => product._id === items);
//             if (cartItems[items] > 0) {
//                 totalAmount += itemInfo.offerPrice * cartItems[items];
//             }
//         }
//         return Math.floor(totalAmount * 100) / 100;
//     }

//     useEffect(() => {
//         fetchProductData()
//     }, [])

//     useEffect(() => {
//         fetchUserData()
//     }, [])

//     const value = {
//         user,
//         currency, router,
//         isSeller, setIsSeller,
//         userData, fetchUserData,
//         products, fetchProductData,
//         cartItems, setCartItems,
//         addToCart, updateCartQuantity,
//         getCartCount, getCartAmount
//     }

//     return (
//         <AppContext.Provider value={value}>
//             {props.children}
//         </AppContext.Provider>
//     )
// }

'use client'
import { productsDummyData, userDummyData } from "@/assets/assets";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { createContext, useContext, useEffect, useState } from "react";

export const AppContext = createContext();

export const useAppContext = () => {
    return useContext(AppContext);
};

export const AppContextProvider = ({ children }) => {
    const currency = process.env.NEXT_PUBLIC_CURRENCY;
    const router = useRouter();
    const { user } = useUser();

    const [products, setProducts] = useState([]);
    const [userData, setUserData] = useState(null);
    const [isSeller, setIsSeller] = useState(true);
    const [cartItems, setCartItems] = useState({});

    useEffect(() => {
        setProducts(productsDummyData);
        setUserData(userDummyData);
    }, []);

    const addToCart = (itemId) => {
        setCartItems((prevCart) => ({
            ...prevCart,
            [itemId]: (prevCart[itemId] || 0) + 1,
        }));
    };

    const updateCartQuantity = (itemId, quantity) => {
        setCartItems((prevCart) => {
            const updatedCart = { ...prevCart };
            if (quantity === 0) {
                delete updatedCart[itemId];
            } else {
                updatedCart[itemId] = quantity;
            }
            return updatedCart;
        });
    };

    const getCartCount = () => {
        return Object.values(cartItems).reduce((acc, count) => acc + count, 0);
    };

    const getCartAmount = () => {
        return Object.entries(cartItems).reduce((total, [itemId, count]) => {
            const itemInfo = products.find((product) => product._id === itemId);
            return itemInfo ? total + itemInfo.offerPrice * count : total;
        }, 0).toFixed(2);
    };

    return (
        <AppContext.Provider value={{
            user,
            currency, router,
            isSeller, setIsSeller,
            userData,
            products,
            cartItems, setCartItems,
            addToCart, updateCartQuantity,
            getCartCount, getCartAmount
        }}>
            {children}
        </AppContext.Provider>
    );
};
