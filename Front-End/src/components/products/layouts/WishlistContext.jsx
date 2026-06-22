import { createContext, useContext, useEffect, useState } from "react";

const WishlistContext = createContext();

const getItemKey = (item) => item.key ?? `${item.type || "product"}-${item.id}`;

export function WishlistProvider({ children }) {
  const [wishlist, setWishlist] = useState(() => {
    const saved = localStorage.getItem("wishlist");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem("wishlist", JSON.stringify(wishlist));
  }, [wishlist]);

  const addToWishlist = (product) => {
    const itemKey = getItemKey(product);
    const exists = wishlist.some((item) => getItemKey(item) === itemKey);

    if (!exists) {
      setWishlist([...wishlist, { ...product, key: itemKey }]);
    }
  };

  const removeFromWishlist = (item) => {
    const itemKey = typeof item === "object" ? getItemKey(item) : item;
    setWishlist(
      wishlist.filter((wishItem) => getItemKey(wishItem) !== itemKey),
    );
  };

  const isFavorite = (item) => {
    const itemKey = typeof item === "object" ? getItemKey(item) : item;
    const normalizedKey = `${itemKey}`.includes("-")
      ? itemKey
      : `product-${itemKey}`;

    return wishlist.some(
      (wishItem) =>
        getItemKey(wishItem) === normalizedKey || wishItem.id === item,
    );
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        addToWishlist,
        removeFromWishlist,
        isFavorite,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

export const useWishlist = () => useContext(WishlistContext);
