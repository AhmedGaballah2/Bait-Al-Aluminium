import { createContext, useContext, useState, useEffect } from "react";

const CartContext = createContext();

const getItemKey = (item) => item.key ?? `${item.type || "product"}-${item.id}`;

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState(() => {
    const savedCart = localStorage.getItem("cart");
    return savedCart ? JSON.parse(savedCart) : [];
  });

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cartItems));
  }, [cartItems]);

  const increaseQty = (key) => {
    setCartItems((prev) =>
      prev.map((item) =>
        getItemKey(item) === key
          ? {
              ...item,
              quantity:
                item.quantity < item.stock ? item.quantity + 1 : item.quantity,
            }
          : item,
      ),
    );
  };

  const decreaseQty = (key) => {
    setCartItems(
      (prev) =>
        prev
          .map((item) =>
            getItemKey(item) === key
              ? { ...item, quantity: item.quantity - 1 }
              : item,
          )
          .filter((item) => item.quantity > 0), // لو وصل 0 يشيله
    );
  };

  const addToCart = (product, quantity = 1) => {
    const itemKey = getItemKey(product);
    const stock = product.stock ?? Infinity;

    setCartItems((prev) => {
      const exists = prev.find((item) => getItemKey(item) === itemKey);

      if (exists) {
        const newQty = exists.quantity + quantity;

        if (newQty > stock) {
          return prev.map((item) =>
            getItemKey(item) === itemKey ? { ...item, quantity: stock } : item,
          );
        }

        return prev.map((item) =>
          getItemKey(item) === itemKey ? { ...item, quantity: newQty } : item,
        );
      }

      return [
        ...prev,
        {
          ...product,
          key: itemKey,
          quantity: Math.min(quantity, stock),
        },
      ];
    });
  };

  const removeFromCart = (key) => {
    setCartItems((prev) => prev.filter((item) => getItemKey(item) !== key));
  };

  return (
    <CartContext.Provider
      value={{ cartItems, addToCart, removeFromCart, increaseQty, decreaseQty }}
    >
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
