import { createContext, useState, useEffect, useContext } from 'react';
import AuthContext from './AuthContext';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const [cart, setCart] = useState([]);
    const [restaurant, setRestaurant] = useState(null);
    const { user } = useContext(AuthContext);

    const [isInitialized, setIsInitialized] = useState(false);

    useEffect(() => {
        const loadCart = async () => {
            setIsInitialized(false);
            const userId = user ? user._id : 'guest';
            const savedCart = localStorage.getItem(`cart_${userId}`);
            const savedRestaurant = localStorage.getItem(`cartRestaurant_${userId}`);

            // Check if we need to migrate guest cart to user
            if (user) {
                const guestCart = localStorage.getItem('cart_guest');
                const guestRestaurant = localStorage.getItem('cartRestaurant_guest');

                if (guestCart && JSON.parse(guestCart).length > 0) {
                    const parsedGuestCart = JSON.parse(guestCart);
                    const parsedGuestRestaurant = JSON.parse(guestRestaurant);

                    // If user cart is empty, simply take guest cart
                    if (!savedCart || JSON.parse(savedCart).length === 0) {
                        setCart(parsedGuestCart);
                        setRestaurant(parsedGuestRestaurant);
                        setIsInitialized(true);
                        return; // We will save this to user storage in the next effect
                    }

                    // Strategy: If guest cart is active/recent (we just logged in), use it.
                    setCart(parsedGuestCart);
                    setRestaurant(parsedGuestRestaurant);

                    // Clear guest cart to prevent repeated merging/overwriting on future reloads
                    localStorage.removeItem('cart_guest');
                    localStorage.removeItem('cartRestaurant_guest');
                    setIsInitialized(true);
                    return;
                }
            }

            if (savedCart) {
                setCart(JSON.parse(savedCart));
            } else {
                setCart([]);
            }

            if (savedRestaurant) {
                setRestaurant(JSON.parse(savedRestaurant));
            } else {
                setRestaurant(null);
            }
            setIsInitialized(true);
        };

        loadCart();
    }, [user]);

    useEffect(() => {
        if (!isInitialized) return;
        const userId = user ? user._id : 'guest';
        localStorage.setItem(`cart_${userId}`, JSON.stringify(cart));
        localStorage.setItem(`cartRestaurant_${userId}`, JSON.stringify(restaurant));
    }, [cart, restaurant, user, isInitialized]);

    const addToCart = (item, currentRestaurant) => {
        // Check if adding from a different restaurant
        if (restaurant && restaurant._id !== currentRestaurant._id) {
            if (!window.confirm("Start a new basket? Adding items from a new restaurant will clear your current cart.")) {
                return;
            }
            setCart([]);
        }

        setRestaurant(currentRestaurant);

        setCart((prevCart) => {
            const existingItem = prevCart.find((i) => i._id === item._id);
            if (existingItem) {
                return prevCart.map((i) =>
                    i._id === item._id ? { ...i, quantity: i.quantity + 1 } : i
                );
            }
            return [...prevCart, { ...item, quantity: 1 }];
        });
    };

    const removeFromCart = (itemId) => {
        setCart((prevCart) => prevCart.filter((i) => i._id !== itemId));
        if (cart.length === 1) setRestaurant(null);
    };

    const updateQuantity = (itemId, quantity) => {
        if (quantity < 1) {
            removeFromCart(itemId);
            return;
        }
        setCart((prevCart) =>
            prevCart.map((i) => (i._id === itemId ? { ...i, quantity } : i))
        );
    };

    const clearCart = () => {
        setCart([]);
        setRestaurant(null);
    };

    const cartTotal = cart.reduce((total, item) => total + item.price * item.quantity, 0);

    return (
        <CartContext.Provider value={{ cart, restaurant, addToCart, removeFromCart, updateQuantity, clearCart, cartTotal }}>
            {children}
        </CartContext.Provider>
    );
};

export default CartContext;
