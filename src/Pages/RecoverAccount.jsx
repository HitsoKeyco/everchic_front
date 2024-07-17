import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import './css/RecoverAccount.css'
import { useNavigate, useParams } from 'react-router-dom'
import axios from 'axios'
import Swal from 'sweetalert2'
import { Backdrop, CircularProgress } from '@mui/material'


const RecoverAccount = () => {
    const { register, handleSubmit, reset, formState: { errors } } = useForm()
    const { verificationToken } = useParams(); // Obtener el token de verificación de los parámetros de la URL
    const navigate = useNavigate()

    const [isShowPass, setIsShowPass] = useState(false)
    const [loading, setLoading] = useState(false); // Estado de carga

    //Funcion que controla la visualizacion de la contraseña
    const handleShowHiddenPass = () => {
        setIsShowPass(!isShowPass)
    }

    const submit = async (data) => {
        setLoading(true)
        const urlApi = import.meta.env.VITE_API_URL;
        const newData = { token: verificationToken, password: data.password }
        try {
            await axios.post(`${urlApi}/users/update_password`, newData);
            Swal.fire({
                title: "Éxito",
                text: "Contraseña actualizada con éxito",
                icon: "success",
                button: "OK",
            });
            setLoading(false)
            reset(); // Restablecer el formulario
            navigate("/"); // Redireccionar a la página de inicio de sesión
        } catch (error) {
            setLoading(false)
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
        <div className='recover_account_update_container'>
            <form className='recover_form' onSubmit={handleSubmit(submit)}>
                <h1 className="recover_account_update_title">Recuperación de cuenta:</h1>
                <div className='recover_account_update_elements_container'>
                    <input
                        className="recover_account_update_input"
                        type={isShowPass ? 'text' : 'password'}
                        name="password"
                        id="password"
                        placeholder='Ingrese su nueva contraseña'
                        {...register("password", { required: "La contraseña es obligatoria" })}
                    />
                    {errors.password && <span>{errors.password.message}</span>}

                    <div className="login_show_hidden_pass" onClick={handleShowHiddenPass}>
                        {
                            isShowPass ?
                                (<i className='bx bx-show register_show_hidden_pass_icon' ></i>)
                                :
                                (<i className='bx bx-hide register_show_hidden_pass_icon'></i>)
                        }
                    </div>
                </div>
                <button type="submit" className="recover_account_update_button button">Actualizar Contraseña</button>
            </form>
            <Backdrop
                sx={{
                    color: '#fff',
                    zIndex: (theme) => theme.zIndex.drawer + 1
                }}
                open={loading}
            >
                <CircularProgress color="inherit" />
            </Backdrop>
        </div>
    )
}

export default RecoverAccount
