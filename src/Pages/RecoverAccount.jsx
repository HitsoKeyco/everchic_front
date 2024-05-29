import React from 'react'
import { useForm } from 'react-hook-form'
import './css/RecoverAccount.css'
import { useNavigate, useParams } from 'react-router-dom'
import axios from 'axios'
import Swal from 'sweetalert2'


const RecoverAccount = () => {
    const { register, handleSubmit, reset, formState: { errors } } = useForm()
    const { verificationToken } = useParams(); // Obtener el token de verificación de los parámetros de la URL
    const navigate = useNavigate()

    const submit = async (data) => {        
        const urlApi = import.meta.env.VITE_API_URL;
        const newData = { token: verificationToken, password: data.password  }
        try {
            await axios.post(`${urlApi}/users/update_password`, newData);            
            Swal.fire({
                title: "Éxito",
                text: "Contraseña actualizada con éxito",
                icon: "success",
                button: "OK",
            });
            reset(); // Restablecer el formulario
            navigate("/"); // Redireccionar a la página de inicio de sesión
        } catch (error) {
            console.error("Error al actualizar la contraseña:", error);
            Swal.fire({
                title: "Error",
                text: "Hubo un error al actualizar la contraseña",
                icon: "error",
                button: "OK",
            });
        }
    }

    return (
        <div className='recover_account_container'>
            <h1 className="recover_account_title">Recuperación de cuenta:</h1>
            <form onSubmit={handleSubmit(submit)}>
                <div className='recover_account_elements_container'>                        
                    <input 
                        className="recover_account_input" 
                        type="password" 
                        name="password" 
                        id="password" 
                        placeholder='Ingrese su nueva password' 
                        {...register("password", { required: "La contraseña es obligatoria" })}
                    />
                    {errors.password && <span>{errors.password.message}</span>}
                </div>
                <button type="submit" className="recover_account_button">Actualizar Contraseña</button>
            </form>
        </div>
    )
}

export default RecoverAccount
