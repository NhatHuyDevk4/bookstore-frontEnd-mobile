import {
  View,
  Text,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Image,
  Alert,
  ActivityIndicator,
} from "react-native";
import React, { useState, useEffect } from "react";
import { useRouter } from "expo-router";
import styles from "../../assets/styles/create.styles";
import { Ionicons } from "@expo/vector-icons";
import COLORS from "../../constants/colors";
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system";
import { useAuthStore } from "../../store/authStore";

const Create = () => {
  const [title, setTitle] = useState("");
  const [caption, setCaption] = useState("");
  const [rating, setRating] = useState(3);
  const [image, setImage] = useState(null);
  const [imageBase64, setImageBase64] = useState(null);
  const [loading, setLoading] = useState(false);

  const router = useRouter();
  const { token } = useAuthStore();

  // const pickImage = async () => {
  //   try {
  //     if (Platform.OS !== "web") {
  //       const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
  //       console.log("Camera permission status:", status);
  //       if (status !== "granted") {
  //         Alert.alert("Permission to access camera roll is required!");
  //         return;
  //       }
  //     }

  //     const result = await ImagePicker.launchImageLibraryAsync({
  //       mediaTypes: ImagePicker.MediaTypeOptions.Images,
  //       allowsEditing: true,
  //       aspect: [4, 3],
  //       quality: 0.2, // Reduced quality to minimize size
  //       base64: true,
  //     });

  //     // console.log("Image picker result:", result);

  //     if (!result.canceled) {
  //       const uri = result.assets[0].uri;
  //       // console.log("Selected image URI:", uri);
  //       setImage(uri);
  //       if (result.assets[0].base64) {
  //         // console.log("Base64 length:", result.assets[0].base64.length);
  //         if (result.assets[0].base64.length > 1_000_000) {
  //           Alert.alert("Image too large", "Please select a smaller image.");
  //           return;
  //         }
  //         setImageBase64(result.assets[0].base64);
  //       } else {
  //         const base64 = await FileSystem.readAsStringAsync(uri, {
  //           encoding: FileSystem.EncodingType.Base64,
  //         });
  //         // console.log("Converted base64 length:", base64.length);
  //         if (base64.length > 1_000_000) {
  //           Alert.alert("Image too large", "Please select a smaller image.");
  //           return;
  //         }
  //         setImageBase64(base64);
  //       }
  //     } else {
  //       // console.log("Image selection canceled");
  //     }
  //   } catch (error) {
  //     // console.error("Error picking image:", error);
  //     Alert.alert("Error picking image", error.message);
  //   }
  // };

  const handleSubmit = async () => {
    if (!title || !caption || !image || !rating) {
      Alert.alert("Please fill all fields!");
      return;
    }

    try {
      setLoading(true);

      if (!token) {
        throw new Error("Authentication token is missing!");
      }

      // const uriParts = image.split(".");
      // const fileType = uriParts[uriParts.length - 1];
      // const imageType = fileType ? `image/${fileType.toLowerCase()}` : `image/jpeg`;

      // const imageDataUrl = `data:${imageType};base64,${imageBase64}`;

      console.log("Request payload:", {
        title,
        caption,
        rating,
        image: image
      });

      const response = await fetch("https://bookstore-backend-mobile.onrender.com/api/books/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title,
          caption,
          rating: rating.toString(),
          image: image,
        }),
      });


      const data = await response.json();
      console.log("Success response:", data);

      Alert.alert("Success", "Book recommendation added successfully!");
      setTitle("");
      setCaption("");
      setImage(null);
      setImageBase64(null);
      setRating(3);
      router.push("/");

    } catch (error) {
      console.error("Error submitting book:", error);
      Alert.alert("Error", error.message || "Something went wrong! Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const renderRatingPicker = () => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <TouchableOpacity key={i} onPress={() => setRating(i)} style={styles.starButton}>
          <Ionicons
            name={i <= rating ? "star" : "star-outline"}
            size={32}
            color={i <= rating ? "#f4b400" : COLORS.textSecondary}
          />
        </TouchableOpacity>
      );
    }

    return <View style={styles.ratingContainer}>{stars}</View>;
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : "height"}>
      <ScrollView contentContainerStyle={styles.container} style={styles.scrollViewStyle}>
        <View style={styles.card}>
          <View style={styles.header}>
            <Text style={styles.title}>Add Book Recommendation</Text>
            <Text style={styles.subtitle}>Share your favorite read with others</Text>
          </View>

          <View style={styles.form}>
            <View style={styles.formGroup}>
              <Text style={styles.label}>Book Title</Text>
              <View style={styles.inputContainer}>
                <Ionicons name="book-outline" size={20} />
                <TextInput
                  style={styles.input}
                  placeholder="Enter book title"
                  placeholderTextColor="#999"
                  value={title}
                  onChangeText={setTitle}
                />
              </View>
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Rating</Text>
              {renderRatingPicker()}
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Book Image URL</Text>
              <TextInput
                style={styles.inputContainer}
                placeholder="Enter image URL"
                placeholderTextColor="#999"
                value={image}
                onChangeText={setImage}
              />
              {image ? (
                <Image
                  source={{ uri: image }}
                  style={styles.image}
                  onError={() => Alert.alert("Invalid Image URL", "The provided URL is not a valid image.")}
                />
              ) : (
                <View >
                  <Ionicons name="image-outline" size={40} color={COLORS.primary} />
                  <Text style={styles.imagePickerText}>No image preview</Text>
                </View>
              )}
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Book Caption</Text>
              <TextInput
                style={styles.textArea}
                placeholder="Enter book caption"
                placeholderTextColor="#999"
                value={caption}
                onChangeText={setCaption}
                multiline
              />
            </View>

            <TouchableOpacity style={styles.button} onPress={handleSubmit} disabled={loading}>
              {loading ? (
                <ActivityIndicator color={COLORS.white} />
              ) : (
                <>
                  <Ionicons
                    name="cloud-upload-outline"
                    size={20}
                    color={COLORS.white}
                    style={styles.buttonIcon}
                  />
                  <Text style={styles.buttonText}>Share</Text>
                </>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default Create;