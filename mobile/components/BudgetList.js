import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from "react-native-vector-icons/MaterialIcons";
import { FormatRupiah } from '../utils/NumberFormat';

const BudgetList = ({ targetData }) => {
    const [generatedTexts, setGeneratedTexts] = useState([]); 

    const renderTargetItem = ({ item, index }) => (
        <View style={[styles.targetCard, { backgroundColor: item.color }]}>
            <Icon 
                name={generatedTexts[index] || 'help-outline'} 
                size={30}
                color="#ffffff"
                style={styles.icon}
            />
            <Text style={styles.targetCardAmount}>{FormatRupiah(item.limit)}</Text>
            <Text style={styles.targetCardLabel}>{item.name}</Text>
        </View>
    );

    
    const fetchGeneratedText = async (name, index) => {
        try {
        const response = await fetch(`https://text.pollinations.ai/berikan%201%20icon%20yang%20ada%20pada%20MaterialIcons%20https://oblador.github.io/react-native-vector-icons%20berhubungan%20dengan%20${encodeURIComponent(name)}%20berikan%201%20name%20tanpa%20ada%20penjelasan%20dan%20tanda%20%22%20atau%20'`);
        // const response = await fetch(`https://text.pollinations.ai/icon%20yang%20berhubungan%20dengan%20${encodeURIComponent(label)}%20pada%20react-native-vector-icons/MaterialIcons%20berikan%201%20kata%20aja`);
        const result = await response.text();
        const cleanedResult = result.replace(/"/g, '');
        

        setGeneratedTexts(prevState => {
            const updatedTexts = [...prevState];
            updatedTexts[index] = cleanedResult;
            return updatedTexts;
        });
        } catch (error) {
        console.error(error);
        setGeneratedTexts(prevState => {
            const updatedTexts = [...prevState];
            updatedTexts[index] = 'Failed to fetch text.';
            return updatedTexts;
        });
        }
    };

    useEffect(() => {
        targetData.forEach((item, index) => {
            fetchGeneratedText(item.name, index);
        });
    }, []);

    return (
        <View style={styles.targetContainer}>
            <View style={styles.targetHeader}>
                <Text style={styles.targetTitle}>Budgets</Text>
                <TouchableOpacity>
                    <View style={styles.iconCircleGreen}>
                        <Icon name="add" size={24} color="white" />
                    </View>
                </TouchableOpacity>
            </View>
            <FlatList
                data={targetData}
                renderItem={renderTargetItem}
                keyExtractor={(item) => item._id}
                horizontal={true}
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.targetList}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    iconCircleGreen: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: "lime",
        justifyContent: "center",
        alignItems: "center",
    },
    targetContainer: {
        paddingHorizontal: 16,
        paddingTop: 10,
    },
    targetTitle: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    targetList: {
        paddingVertical: 10,
    },
    targetCard: {
        width: 150,
        height: 100,
        borderRadius: 16, 
        marginRight: 10,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 16,
        overflow: 'hidden',
    },
    icon: {
        width: 30,
        height: 30,
        position: 'absolute',
        top: 10,
        right: 10,
        zIndex: 1, 
    },
    targetCardAmount: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#fff',
        position: 'absolute',
        bottom: 10, 
        left: 10,  
        marginBottom: 5,
        paddingBottom: 5,
    },
    targetCardLabel: {
        fontSize: 14,
        color: '#fff',
        position: 'absolute',
        bottom: 5,  
        left: 10, 
    },
    targetHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between', // Supaya teks kiri & ikon kanan
        alignItems: 'center',
    },
});

export default BudgetList;
