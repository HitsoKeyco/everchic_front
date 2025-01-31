import { useState } from 'react';
import { Link } from 'react-router-dom';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { IconButton, InputAdornment } from '@mui/material';
import TextFieldElement from './TextFieldElement';
import PropTypes from 'prop-types';

const RegisterUser = ({ register, errors, trigger }) => {
    const [showPassword, setShowPassword] = useState(false);
    const handleClickShowPassword = () => setShowPassword((show) => !show);

    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };

    

    return (
        <>
            <span className='add_customer_title'>Registro:</span>
            
            <TextFieldElement
                name="email"
                label="Email:"
                errors={errors}
                register={register}
                validation={{
                    required: { value: true, message: 'Este campo es requerido' },
                    maxLength: { value: 30, message: 'Máximo 30 caracteres' },
                    pattern: {
                        value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                        message: 'Debe ser un email válido',
                    },
                }}
                trigger={trigger}
            />

            <TextFieldElement
                name="password"
                label="Contraseña:"
                type={showPassword ? 'text' : 'password'}
                errors={errors}
                register={register}
                validation={{
                    required: { value: true, message: 'Este campo es obligatorio' },
                    minLength: { value: 6, message: 'Debe tener al menos 6 caracteres.' },
                    pattern: {
                        value: /^(?=.*[!@#$%^&*])/,
                        message: 'Debe contener al menos un carácter especial.',
                    },
                }}
                endAdornment={
                    <InputAdornment position="end">
                        <IconButton
                            onClick={handleClickShowPassword}
                            onMouseDown={handleMouseDownPassword}
                        >
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                    </InputAdornment>
                }
                trigger={trigger}
            />

            <TextFieldElement
                name="repeat_password"
                label="Repetir Contraseña:"
                type={showPassword ? 'text' : 'password'}
                errors={errors}
                register={register}
                validation={{
                    required: { value: true, message: 'Este campo es obligatorio' },
                    minLength: { value: 6, message: 'Debe tener al menos 6 caracteres.' },
                    pattern: {
                        value: /^(?=.*[!@#$%^&*])/,
                        message: 'Debe contener al menos un carácter especial.',
                    },
                }}
                endAdornment={
                    <InputAdornment position="end">
                        <IconButton
                            onClick={handleClickShowPassword}
                            onMouseDown={handleMouseDownPassword}
                        >
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                    </InputAdornment>
                }
                trigger={trigger}
            />

            <div className="add_customer_items_container_agreeToTerms">
                <div className="add_customer_items_agreeToTerms">
                    <input
                        className={`add_customer_input_chekbox ${errors.agreeToTerms ? 'input_error' : ''}`}
                        type="checkbox"
                        id="agreeToTerms"
                        name="agreeToTerms"
                        {...register('agreeToTerms', {
                            required: { value: true, message: 'Este campo es requerido.' },
                        })}
                    />
                    <Link to="/terms">Acepto los términos y condiciones.</Link>
                </div>
                {errors.agreeToTerms && <p className="error_message">{errors.agreeToTerms.message}</p>}
            </div>
        </>
    );
};

RegisterUser.propTypes = {
    register: PropTypes.func.isRequired,
    errors: PropTypes.object.isRequired,
    watch: PropTypes.func.isRequired,
    trigger: PropTypes.func.isRequired,
};

export default RegisterUser;
