import PropTypes from 'prop-types';
import { useState } from 'react';
import './css/AddCustomer.css';
import { useSelector } from 'react-redux';
import { Accordion, AccordionDetails, AccordionSummary, Button, Box } from '@mui/material';
import RegisterUser from './RegisterUser';
import TextFieldElement from './TextFieldElement';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const AddCustomer = (
    { 
        register, 
        setValue, 
        reset,        
        clearErrors, 
        errors, 
        handleSubmit, 
        watch, 
        onSubmitForm, 
        trigger, 
        isEditable, 
        setIsEditable 
    }) => {

    const user = useSelector(state => state.user.data);
        
    const [expanded, setExpanded] = useState(true);

    const handleExpandAccordion = () => {
        setExpanded(!expanded);
    }
    return (
        <>
            <Accordion expanded={expanded} onChange={handleExpandAccordion} >
                <AccordionSummary id="panel-header" aria-controls="panel-content" expandIcon={<ExpandMoreIcon />}>
                    <p className='add_customer_title'>Información de usuario - Envío</p>
                </AccordionSummary>
                <AccordionDetails  >
                    <div className='add_customer_info_shipping' >
                        {/*------------------------------\\ dni //-----------------------------------*/}
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                            <TextFieldElement
                                name="dni"
                                label='Cédula ó RUC:'
                                errors={errors}
                                disabled={!isEditable}                                                 
                                register={register}
                                validation={{
                                    required: { value: true, message: 'Este campo es requerido' },
                                    minLength: { value: 10, message: 'Mínimo 10 caracteres' },
                                    maxLength: { value: 13, message: 'Máximo 13 caracteres' },
                                    pattern: {
                                        value: /^[0-9]{10,13}$/,
                                        message: 'La cédula/RUC solo debe contener números',
                                    }
                                }}
                            />

                            <TextFieldElement
                                name="firstName"
                                label='Nombres:'
                                errors={errors}
                                disabled={!isEditable}                                
                                register={register}
                                validation={{
                                    required: { value: true, message: 'Este campo es requerido' },
                                    maxLength: { value: 25, message: 'Máximo 25 caracteres' },
                                    pattern: {
                                        value: /^[a-zA-Z\s]+$/,
                                        message: 'El nombre solo debe contener letras',
                                    }
                                }}
                            />

                            <TextFieldElement
                                name="lastName"
                                label='Apellidos:'
                                errors={errors}                                
                                disabled={!isEditable}
                                register={register}
                                validation={{
                                    required: { value: true, message: 'Este campo es requerido' },
                                    maxLength: { value: 25, message: 'Máximo 25 caracteres' },
                                    pattern: {
                                        value: /^[a-zA-Z\s]+$/,
                                        message: 'El apellido solo debe contener letras',
                                    }
                                }}
                            />

                            <TextFieldElement
                                name="phone_first"
                                label='Teléfono:'
                                errors={errors}                                
                                disabled={!isEditable}
                                register={register}
                                validation={{
                                    required: { value: true, message: 'Este campo es requerido' },
                                    maxLength: { value: 10, message: 'Máximo 10 caracteres' },
                                    pattern: {
                                        value: /^[0-9]{10}$/,
                                        message: 'El teléfono debe ser un número de 10 dígitos',
                                    }
                                }}
                            />

                            <TextFieldElement
                                name="phone_second"
                                label='Teléfono adicional:'
                                errors={errors}                                
                                disabled={!isEditable}
                                register={register}
                                validation={{
                                    required: { value: false, message: 'Este campo es opcional' },
                                    maxLength: { value: 10, message: 'Máximo 10 caracteres' },
                                    pattern: {
                                        value: /^[0-9]{10}$/,
                                        message: 'El teléfono adicional debe ser un número de 10 dígitos',
                                    }
                                }}
                            />


                            <TextFieldElement
                                name="city"
                                label='Ciudad:'
                                errors={errors}                                
                                disabled={!isEditable}
                                register={register}
                                validation={{
                                    required: { value: true, message: 'Este campo es requerido' },
                                    maxLength: { value: 30, message: 'Máximo 30 caracteres' },
                                    pattern: {
                                        value: /^[a-zA-Z]+$/,
                                        message: 'La ciudad solo debe contener letras',
                                    }
                                }}
                            />

                            {
                                user?.isVerify &&
                                <>
                                    <TextFieldElement
                                        name="email"
                                        label='email:'
                                        errors={errors}
                                        disabled={true}                                        
                                        register={register}
                                        validation={{
                                            required: { value: true, message: 'Este campo es requerido' },
                                            maxLength: { value: 30, message: 'Máximo 30 caracteres' },
                                            pattern: {
                                                value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                                                message: 'Debe ser un email válido',
                                            }
                                        }}
                                    />
                                </>
                            }

                            <TextFieldElement
                                name="address"
                                label='Dirección:'
                                errors={errors}
                                disabled={!isEditable}                                
                                multiline={true}
                                register={register}
                                validation={{
                                    required: { value: true, message: 'Este campo es requerido' },
                                    maxLength: 200,
                                    pattern: {
                                        value: /^[a-zA-ZáéíóúüñÁÉÍÓÚÜÑ0-9\s\-,.#/°]+$/,
                                        message: 'La dirección solo debe contener letras, números, espacios y caracteres como: - , . # / °',
                                    }
                                }}
                            />

                        </Box>
                        {
                            !user?.isVerify

                                ?

                                ''
                                :
                                <div className='profile_buttons_container'>
                                    <Button className="profile_button" type="button"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            setIsEditable(prev => !prev);
                                            // saveDataUser();
                                        }}>
                                        {isEditable ? 'Bloquear' : 'desbloquear'}
                                    </Button>

                                </div>

                        }

                        {/*------------------------------\\ Usuario Nuevo //-----------------------------------*/}
                        {
                            !user?.isVerify ?
                                <>
                                    <RegisterUser
                                        register={register}
                                        setValue={setValue}
                                        reset={reset}
                                        clearErrors={clearErrors}
                                        handleSubmit={handleSubmit}
                                        watch={watch}
                                        errors={errors}
                                        onSubmitForm={onSubmitForm}
                                        trigger={trigger}
                                    />

                                </> : ''
                        }
                    </div>
                </AccordionDetails>
            </Accordion>
        </>
    );
};



AddCustomer.propTypes = {
    register: PropTypes.func.isRequired,
    setValue: PropTypes.func.isRequired,
    reset: PropTypes.func.isRequired,
    clearErrors: PropTypes.func.isRequired,
    errors: PropTypes.object.isRequired,
    handleSubmit: PropTypes.func.isRequired,
    watch: PropTypes.func.isRequired,
    onSubmitForm: PropTypes.func.isRequired,
    trigger: PropTypes.func.isRequired,
    isEditable: PropTypes.bool.isRequired,
    setIsEditable: PropTypes.func.isRequired,
};



export default AddCustomer;
