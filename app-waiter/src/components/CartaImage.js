import React, { useEffect, useState } from "react";
import { Image, View } from "react-native";
import { fetchImageAsBase64 } from "../api/client";

export default function CartaImage({ imagenUrl, style }) {
  const [uri, setUri] = useState(null);

  useEffect(() => {
    if (!imagenUrl) return;
    setUri(imagenUrl);
  }, [imagenUrl]);

  if (!uri) return <View style={[style, { backgroundColor: "#334155" }]} />;
  return <Image source={{ uri }} style={style} resizeMode="cover" />;
}
