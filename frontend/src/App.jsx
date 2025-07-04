import ExcelUpload from "./ExcelUpload";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import FieldValidationForm from "./FieldValidationForm";
import { ToastContainer } from 'react-toastify';

const App = () => {
  return (
    <>
      <ToastContainer />
      <ExcelUpload/>
    </>
  )
}

export default App
