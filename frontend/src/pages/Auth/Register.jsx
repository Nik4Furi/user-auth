import React, { useState } from 'react'

import { Link, useNavigate } from 'react-router-dom'

import { Box, Heading, VStack, Container, Text } from '@chakra-ui/react'

import toast from 'react-hot-toast'

//----------Store Specific Stuff
import { useDispatch, useSelector } from 'react-redux'
import { handleRegisterUser } from '../../Store/UsersSlice'

//Icons/Images Stuff
import { AiOutlineMail, AiOutlineUser } from 'react-icons/ai'

//Components Stuff
import FormInput from '../../components/Layout/FormInput'
import { FormInputPassword } from './Login'
import Buttons from '../../components/Layout/Buttons'


const Register = () => {

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const {loading} = useSelector(state=>state.user);

    //------------------ Form Specific Stuff ----------------

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        cpassword: ''
    });

    //Function to handle the onchange event on input data
    const handleOnChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });


    //---------- Function to submit the form data or can say login the users 
    const handleSubmit = async (e) => {
        e.preventDefault();

        console.log(formData);

        const { password, cpassword } = formData;

        if (password !== cpassword) {
            toast.error("Password and confirm password didn't match");
            setFormData({ ...formData, password: '', cpassword: '' })
            return;
        }
     
        dispatch(handleRegisterUser(formData));

        
        setFormData({ name: '', email: '', password: '', cpassword: ''});

        setTimeout(()=>{
            navigate('/')
        },3000)
    }
    //----------------------------Form Specific Stuff   - x 

    return (
        <>
            <section id="Register">

                <Container minH={'container.md'} my={'5'}>

                    <Heading >Become A Memeber Of Our Community </Heading>

                    <form style={{ minWidth: '100%' }} onSubmit={handleSubmit} my='3'>
                        <VStack >

                            <FormInput type={'text'} label={'Enter Name'} icon={<AiOutlineUser />} name='name' placeholder={'John Doe'} value={formData.name} handleChange={handleOnChange} minlen={5} maxlen={80} />

                            <FormInput type={'email'} label={'Enter Email'} icon={<AiOutlineMail />} name='email' placeholder={'johndoe23@gmail.com'} value={formData.email} handleChange={handleOnChange} minlen={5} maxlen={120} />

                            <FormInputPassword label={'Enter Password'} name={'password'} value={formData.password} handleChange={handleOnChange} />

                            <FormInputPassword label={'Confirm Pasword'} name={'cpassword'} value={formData.cpassword} handleChange={handleOnChange} />

                            <Box w='full' my='4' display={'block'} mx='auto'>
                                <Buttons loading={loading} type={'submit'} fontsize='lg'  width="full" title={'Register'} />
                            </Box>


                        </VStack>

                    </form>
                    <Link to={'/'} ><Text textAlign={'right'} textDecoration={'underline'} variant={'ghost'}>Have Already A Account</Text> </Link>


                </Container>
            </section>
        </>
    )
}

export default Register;