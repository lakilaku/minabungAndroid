import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import TransactionList from '../components/TransactionList';
import BudgetList from '../components/BudgetList';
import { getSecure } from '../utils/SecureStore';
import { gql, useQuery } from '@apollo/client';
import { FormatRupiah } from '../utils/NumberFormat';
import AddTransactionButtons from '../components/AddTransactionButtons';
import AddGroup from '../components/AddGroup';
import { useNavigation } from '@react-navigation/native';

const GET_GROUP_BY_USER_ID = gql`
  query GetGroupByUserId($userId: ID!) {
    getGroupByUserId(userId: $userId) {
      _id
      name
      description
      budgets {
        _id
        name
        limit
        color
      }
      members {
        name
      }
      incomes {
        name
        amount
      }
      expenses {
        name
        amount
      }
    }
  }
`;

const HomeScreen = () => {
  const [userId, setUserId] = useState(null);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchUserData = async () => {
      const user = await getSecure('userData');
      if (user) {
        const parsedUser = JSON.parse(user);
        if (parsedUser._id) {
          setUserId(parsedUser._id);
        }
      }
    };
    fetchUserData();
  }, []);

  const { data, loading, error } = useQuery(GET_GROUP_BY_USER_ID, {
    variables: { userId },
    skip: !userId,
  });

  if (!userId || loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }
  
  if (error) {
    return <Text>Error: {error.message}</Text>;
  }

  const groupData = data?.getGroupByUserId[0] || {};  
  const budgets = groupData.budgets || [];
  const incomes = groupData.incomes || [];
  const groupList = data?.getGroupByUserId || [];

  const totalIncome = incomes.reduce((acc, income) => acc + (income.amount || 0), 0);

  return (
    groupList.length > 0 ? (
      <View style={styles.container}>
        <View style={styles.incomeContainer}>
          <Text style={styles.incomeTitle}>Income</Text>
          <Text style={styles.incomeAmount}>
            {FormatRupiah(totalIncome)}
          </Text>
        </View>

        <BudgetList targetData={budgets} />

        <AddTransactionButtons/>

        <View style={styles.groupContainer}>
          <Text style={styles.groupTitle}>Group</Text>
          <Text style={styles.groupName}>{groupData.name}</Text>
        </View>

        <TransactionList groupId={groupData._id} />
      </View>
    ):(
      <AddGroup navigation={navigation}/>
    )
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5c400',
    paddingTop: 20,
    paddingHorizontal: 10,
  },
  icon: {
    width: 30,
    height: 30,
    position: 'absolute',
    top: 10,
    right: 10,
    zIndex: 1, 
  },
  incomeContainer: {
    paddingTop: 20,
    paddingHorizontal: 16,
  },
  incomeTitle: {
    fontSize: 18,
  },
  incomeAmount: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  addIncomeButton: {
    marginRight: 10,
  },
  addExpenseButton: {
    marginLeft: 10,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    marginRight: 10,
  },
  iconCircleGreen: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'green',
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconCircleRed: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'red',
    justifyContent: 'center',
    alignItems: 'center',
  },
  groupContainer: {
    backgroundColor: '#E6B8E9', // Warna latar belakang pink muda
    borderRadius: 15, // Sudut membulat
    borderWidth: 1, // Garis tepi hitam
    borderColor: 'black',
    padding: 16, // Padding di dalam kotak
    marginHorizontal: 16, // Margin horizontal
    marginVertical: 10, // Margin vertikal
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  groupTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5, // Jarak antara judul dan nama
  },
  groupName: {
    fontSize: 16,
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
});

export default HomeScreen;