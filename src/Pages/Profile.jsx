import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion';
import './css/Profile.css'
import { useForm } from 'react-hook-form';
import { useSelector } from 'react-redux';
import getConfigAuth from '../utils/getConfigAuth';
import axios from 'axios';
import Swal from 'sweetalert2';
import Orders from '../components/Orders';

const Profile = () => {
  const urlApi = import.meta.env.VITE_API_URL;
  const { register, setValue, handleSubmit, formState: { errors } } = useForm();


  const user = useSelector(state => state.user.user);

  useEffect(() => {
    if (user) {
      loadDataUser();
    }
  }, [user])

  /* Actualizar datos */
  const submit = (data) => {
    axios.put(`${urlApi}/users/${user.id}`, data, getConfigAuth())
      .then(res => {
        if (res) {
          Swal.fire({
            position: "center",
            icon: "success",
            text: "Actualización completada",
            showConfirmButton: false,
            timer: 1500
          });
        }
      })
      .catch(err => {
        if (err) {
          Swal.fire({
            position: "center",
            icon: "success",
            text: "Opps.. hay algun error..",
            showConfirmButton: false,
            timer: 1500
          })
        }
      });

  }



  /* -------- Función cargar datos de usuario -----------*/

  const loadDataUser = () => {
    axios.get(`${urlApi}/users/${user.id}`, getConfigAuth())
      .then(res => {
        setValue('dni', res.data.dni);
        setValue('firstName', res.data.firstName);
        setValue('lastName', res.data.lastName);
        setValue('phone_first', res.data.phone_first);
        setValue('phone_second', res.data.phone_second);
        setValue('city', res.data.city);
        setValue('address', res.data.address);
      })
      .catch(err => console.log(err));
  }


  return (
    <>

      <motion.div
        className="product_filter_elements_container"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="profile_container">
          <div className="profile_title_container">
            <div className="profile_avatar_container">
              <img className='profile_avatar' src={`https://api.dicebear.com/8.x/pixel-art/svg?seed=${user?.firstName}`} alt="" />
            </div>
            <div className="profile_avatar_info_container">              
              <h3 className='profile_title'>{ user.firstName + ' ' + user.lastName}</h3>
              <p className='profile_subtitle'>{user.city}</p>
            </div>
          </div>

          <div className="profile_data_customer_container">
            <div className="profile_container_orders">
              <h4 className='profile_title_shipping'>Mis pedidos</h4>
              <Orders />
            </div>

            {/*------------------------------\\ form //-----------------------------------*/}
            <form className="profile_form" onSubmit={handleSubmit(submit)}>
              {/*------------------------------\\ Title component //-----------------------------------*/}

              <h4 className='profile_title_shipping'>Datos de envío</h4>
              {/*------------------------------\\ dni //-----------------------------------*/}
              <div className='profile_elements_container'>
                <label className="profile_label" htmlFor="dni">
                  Cédula ó RUC:
                </label>
                <input
                  type="text" // Cambiado a tipo "text" para permitir una entrada de longitud variable
                  id="dni"
                  name="dni"
                  className={`profile_input ${errors.dni ? 'input-error' : ''}`}
                  {...register('dni', {
                    required: 'Este campo es obligatorio',
                    minLength: {
                      value: 10,
                    },
                    maxLength: {
                      value: 13,
                    },
                    pattern: {
                      value: /^\d+$/, // Expresión regular para permitir solo números                                        
                    }
                  })}
                />
              </div>

              {/*------------------------------\\ FirstName //-----------------------------------*/}
              <div className="profile_elements_container">
                <label className="profile_label" htmlFor="firstName">
                  Nombre:
                </label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  autoComplete="off"
                  className={`profile_input ${errors.firstName ? 'input-error' : ''}`}
                  {...register('firstName', { required: 'Este campo es obligatorio' })}
                />
              </div>
              {/*------------------------------\\ LastName //-----------------------------------*/}
              <div className="profile_elements_container">
                <label className="profile_label" htmlFor="lastName">
                  Apellidos:
                </label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  className={`profile_input ${errors.lastName ? 'input-error' : ''}`}
                  {...register('lastName', { required: 'Este campo es obligatorio' })}
                />
              </div>
              {/*------------------------------\\ Phone 1//-----------------------------------*/}
              <div className="profile_elements_container">
                <label className="profile_label" htmlFor="phone_first">
                  Teléfono 1:
                </label>
                <input
                  type="text"
                  id="phone_first"
                  name="phone_first"
                  placeholder='09XXXXXXXX'
                  className={`profile_input ${errors.phone_first ? 'input-error' : ''}`}
                  {...register('phone_first', {
                    required: 'Este campo es obligatorio',
                    pattern: {
                      value: /^0\d{9}$/,
                    }
                  })}
                />

              </div>

              {/*------------------------------\\ Phone 2//-----------------------------------*/}
              <div className="profile_elements_container">
                <label className="profile_label" htmlFor="phone_second">
                  Teléfono 2:
                </label>
                <input
                  type="number"
                  id="phone_second"
                  name="phone_second"
                  className='profile_input'
                  placeholder='Este campo es opcional'
                  {...register('phone_second')}
                />
              </div>

              {/*------------------------------\\ City //-----------------------------------*/}
              <div className="profile_elements_container">
                <label className="profile_label" htmlFor="city">
                  Ciudad:
                </label>
                <input
                  type="text"
                  id='city'
                  name='city'
                  className={`profile_input ${errors.city ? 'input-error' : ''}`}
                  {...register('city', { required: 'Este campo es obligatorio' })}
                />
              </div>
              {/*------------------------------\\ Address //-----------------------------------*/}
              <div className="profile_elements_container">
                <label className="profile_label" htmlFor="address">
                  Dirección:
                </label>
                <textarea
                  id="address"
                  name="address"
                  autoComplete='on'
                  placeholder='Escriba su dirección y alguna referencia de su vivienda como: color, plantas, decoración. etc.'
                  className={`profile_textarea ${errors.address ? 'input-error' : ''}`}
                  {...register('address', { required: 'Este campo es obligatorio' })}
                />

              </div>
              <button>Actualizar datos</button>

            </form>


          </div>
        </div>
      </motion.div>

    </>
  )
}

export default Profile