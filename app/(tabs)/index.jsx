import { View, Text, KeyboardAvoidingView, Platform, FlatList, ActivityIndicator, Alert, RefreshControl } from 'react-native'
import { Image } from 'expo-image'
import React, { useEffect, useState } from 'react'
import { useAuthStore } from '../../store/authStore'
import styles from '../../assets/styles/home.styles';
import { Ionicons } from '@expo/vector-icons';
import COLORS from '../../constants/colors';
import { formatPublishedDate } from '../../lib/utils';
import Loader from '../../components/Loader';

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const Home = () => {
    const { logout, token } = useAuthStore();

    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);

    const fetchBooks = async (pageNum = 1, refresh = false) => {
        try {
            if (refresh) {
                setRefreshing(true);
            } else if (pageNum === 1) {
                setLoading(true);
            }

            const response = await fetch(`https://bookstore-backend-mobile.onrender.com/api/books?page=${pageNum}&limit=2`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.message || 'Something went wrong!');
            }

            // Append or reset books based on refresh or page number
            setBooks(prevBooks => {
                const newBooks = refresh || pageNum === 1 ? data.books : [...prevBooks, ...data.books];
                // Remove duplicates by _id
                const uniqueBooks = Array.from(new Map(newBooks.map(book => [book._id, book])).values());
                return uniqueBooks;
            });

            setHasMore(pageNum < data.totalPages);
            setPage(pageNum);
        } catch (error) {
            console.error('Error fetching books:', error.message);
            Alert.alert('Error', error.message || 'Failed to fetch books. Please try again.');
        } finally {
            if (refresh) {
                await sleep(800); // Simulate network delay
                setRefreshing(false);
            } else if (pageNum === 1) {
                setLoading(false);
            }
        }
    };

    const handleLoadMore = async () => {
        if (hasMore && !loading && !refreshing) {
            // await sleep(1000); // Simulate network delay
            await fetchBooks(page + 1);
        }
    };

    const handleRefresh = async () => {
        if (!loading && !refreshing) {
            await fetchBooks(1, true);
        }
    };

    const renderItem = ({ item }) => {
        return (
            <View style={styles.bookCard}>
                <View style={styles.bookHeader}>
                    <View style={styles.userInfo}>
                        <Image source={{ uri: item.user.profileImage }} style={styles.avatar} />
                        <Text style={styles.userName}>{item.user.username}</Text>
                    </View>
                </View>

                <View style={styles.bookImageContainer}>
                    <Image
                        source={{ uri: item.image }}
                        style={styles.image}
                        contentFit='cover'
                        onError={() => console.warn(`Failed to load image for book: ${item.title}`)}
                    />
                </View>

                <View style={styles.bookDetails}>
                    <Text style={styles.bookTitle}>{item.title}</Text>
                    <View style={styles.ratingContainer}>
                        {renderRatingStars(item.rating)}
                        <Text style={styles.ratingText}>{item.rating}</Text>
                    </View>
                    <Text style={styles.caption}>{item.caption}</Text>
                    <Text style={styles.date}>Shared on {formatPublishedDate(item.createdAt)}</Text>
                </View>
            </View>
        );
    };

    const renderRatingStars = (rating) => {
        const stars = [];
        for (let i = 1; i <= 5; i++) {
            stars.push(
                <Ionicons
                    key={i}
                    name={i <= rating ? 'star' : 'star-outline'}
                    size={16}
                    color={i <= rating ? '#f4b400' : COLORS.textSecondary}
                    style={{ marginRight: 2 }}
                />
            );
        }
        return stars;
    };

    useEffect(() => {
        fetchBooks();
    }, []);

    if (loading) {
        return (
            <Loader size='large' />
        );
    }

    return (
        <View style={styles.container}>
            <FlatList
                data={books}
                renderItem={renderItem}
                keyExtractor={(item) => item._id}
                contentContainerStyle={styles.listContainer}
                showsVerticalScrollIndicator={false}
                onEndReached={hasMore ? handleLoadMore : null}
                onEndReachedThreshold={0.1}
                refreshing={refreshing}
                // onRefresh={handleRefresh}
                ListHeaderComponent={
                    <View style={styles.header}>
                        <Text style={styles.headerTitle}>Book Recommendations</Text>
                        <Text style={styles.headerSubtitle}>Discover your next favorite read</Text>
                    </View>
                }
                ListFooterComponent={hasMore && books.length ? (
                    <ActivityIndicator style={styles.footerLoader} size="small" color={COLORS.primary} />
                ) : null}
                ListEmptyComponent={
                    !loading && !refreshing ? (
                        <View style={styles.emptyContainer}>
                            <Ionicons name="book-outline" size={50} color={COLORS.textSecondary} />
                            <Text style={styles.emptyText}>No books found</Text>
                        </View>
                    ) : null
                }
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={() => fetchBooks(1, true)}
                        colors={[COLORS.primary]}
                        tintColor={COLORS.primary}
                    />
                }
            />
        </View>
    );
};

export default Home;