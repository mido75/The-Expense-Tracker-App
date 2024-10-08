import { View , Text , StyleSheet } from "react-native";
import { useContext, useLayoutEffect, useState } from "react";
import { GlobalStyles } from "../constants/styles";
import Button from "../components/UI/Button";
import { ExpensesContext } from "../store/ExpensesContext";
import IconButton from "../components/UI/IconButton";
import ExpenseForm from "../components/ManageExpense/ExpenseForm";
import { deleteExpense, storeExpense, updateExpense } from "../Util/http";
import LoadingOverlay from "../components/UI/LoadingOverlay";
import ErrorOverlay from "../components/UI/ErrorOverlay";

function ManageExpense({ route, navigation }) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState();
    const expensesCtx = useContext(ExpensesContext);
  
    const editedExpenseId = route.params?.expenseId;
    const isEditing = !!editedExpenseId;

    const selectedExpense = expensesCtx.expenses.find(
      (expense) => expense.id === editedExpenseId
    );
  
    useLayoutEffect(() => {
      navigation.setOptions({
        title: isEditing ? 'Edit Expense' : 'Add Expense',
      });
    }, [navigation, isEditing]);
  
    async function deleteExpenseHandler() {
      setIsSubmitting(true);
      try{
        await deleteExpense(editedExpenseId);
        expensesCtx.deleteExpense(editedExpenseId);
      }
      catch (error) {
        setError('Could not delete expense - please try again later.');
        setIsSubmitting(false);
      }
      navigation.goBack();
    }
  
    function cancelHandler() {
      navigation.goBack();
    }
  
    async function confirmHandler(expenseData) {
      setIsSubmitting(true);
      try{
        if (isEditing) {
          await updateExpense(editedExpenseId,expenseData);
          expensesCtx.updateExpense(editedExpenseId, expenseData);
        } else {
          const id = await storeExpense(expenseData);
          expensesCtx.addExpense({...expenseData, id:id });
        }
        navigation.goBack();
      }catch (error) {
        setError('Could not save data - please try again later.');
        setIsSubmitting(false);
      }
      
    }

    if (error && !isSubmitting) {
      return <ErrorOverlay message={error} />;
    }

    if (isSubmitting) {
      return <LoadingOverlay />;
    }
  
    return (
      <View style={styles.container}>
        <ExpenseForm onCancel={cancelHandler} onSubmit={confirmHandler} defaultValues={selectedExpense} submitButtonLabel={isEditing ? 'Update' : 'Add'}/>
        {isEditing && (
          <View style={styles.deleteContainer}>
              <IconButton
                  icon="trash"
                  color={GlobalStyles.colors.error500}
                  size={36}
                  onPress={deleteExpenseHandler}
              />
          </View>
        )}
      </View>
    );
  }
  
  export default ManageExpense;
  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 24,
      backgroundColor: GlobalStyles.colors.primary800,
    },
    buttons: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
    },
    button: {
      minWidth: 120,
      marginHorizontal: 8,
    },
    deleteContainer: {
      marginTop: 16,
      paddingTop: 8,
      borderTopWidth: 2,
      borderTopColor: GlobalStyles.colors.primary200,
      alignItems: 'center',
    },
  });