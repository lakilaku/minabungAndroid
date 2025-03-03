import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import Icon from "react-native-vector-icons/MaterialIcons";
import { FormatRupiah } from '../utils/NumberFormat';

const TransactionList = ({ transactions }) => {
    const [generatedTexts, setGeneratedTexts] = useState([]);

    useEffect(() => {
        const fetchGeneratedTexts = async () => {
            const newGeneratedTexts = await Promise.all(
                transactions.map(async (item) => {
                    try {
                        const response = await fetch(`https://text.pollinations.ai/berikan 1 icon yang ada pada MaterialIcons https://oblador.github.io/react-native-vector-icons ${item.name} berikan 1 name tanpa ada penjelasan dan tanda " atau '`);
                        const result = await response.text();
                        // console.log(result);
                        return result;
                    } catch (error) {
                        console.error("Error fetching icon:", error);
                        return 'error-outline'; // Default icon jika gagal
                    }
                })
            );
            setGeneratedTexts(newGeneratedTexts);
        };

        fetchGeneratedTexts();
    }, [transactions]); // `useEffect` hanya dijalankan ketika `transactions` berubah

    return (
        <View style={styles.container}>
            <ScrollView style={styles.expenseContainer}>
                <Text style={styles.expenseTitle}>All Transactions</Text>
                {transactions.map((item, idx) => (
                    <View key={item._id || idx.toString()} style={styles.expenseItem}>
                        <Icon name={generatedTexts[idx] || 'help-outline'} size={24} color="#333" style={styles.expenseIcon} />
                        <Text style={styles.expenseItemName}>{item.name}</Text>
                        <Text style={styles.expenseItemAmount}>{FormatRupiah(item.amount)}</Text>
                        <Icon
                            name={item.type === 'income' ? 'arrow-downward' : 'arrow-upward'}
                            size={20}
                            color={item.type === 'income' ? 'green' : 'red'}
                            style={styles.arrowIcon}
                        />
                    </View>
                ))}
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5c400',
        paddingHorizontal: 10,
    },
    expenseContainer: {
        backgroundColor: 'rgba(255, 255, 255, 0.3)',
        padding: 16,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        flex: 1,
    },
    expenseTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginLeft: 16,
        marginBottom: 10,
        color: '#000',
    },
    expenseItem: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        padding: 12,
        borderRadius: 10,
        marginBottom: 10,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    expenseIcon: {
        marginRight: 10,
    },
    expenseItemName: {
        flex: 1,
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
    },
    expenseItemAmount: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#000',
    },
    arrowIcon: {
        marginLeft: 10,
    },
});

export default TransactionList;
