import React, { useRef } from 'react'

import { Link } from 'react-router-dom'

// Theme switcher
import { ColorModeSwitcher } from '../../ColorModeSwitcher'

import {
  Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  Button,
  useDisclosure,
  Box,
  VStack,
  HStack,
} from '@chakra-ui/react'

// ---------- Redux store specific stuff
import { useSelector } from 'react-redux'

//Icons stuff
import { RiArrowRightLine } from 'react-icons/ri'

// Components Stuff
import Buttons from './Buttons'



function Header() {

  const { isOpen, onOpen, onClose } = useDisclosure();
  
  const btnRef = useRef();

  const { isAuthenticated } = useSelector(state => state.user);


  return (
    <>
      <section id="Header">
        <Box bg={'blackAlpha.300'} position={'relative'} mb='5' zIndex={100} h='16'>
          <ColorModeSwitcher />

          {/* Arrow to switch out the side bar  */}
          <Button onClick={onOpen} colorScheme='purple' position={"fixed"} top='4' left='2'  >
            <RiArrowRightLine />
          </Button>

          {/* Drawer to show our data like a sidenavbar  */}
          <Drawer
            isOpen={isOpen}
            placement='left'
            onClose={onClose}
            finalFocusRef={btnRef}
          >
            <DrawerOverlay />
            <DrawerContent>
              <DrawerHeader>Always Discover Un-certain Things 📖</DrawerHeader>

              <DrawerBody>
                <VStack >
                  <Link to={'/home'}><Button onClick={onClose} variant={'ghost'}>Home</Button></Link>
                  <a href="https://github.com/nik4furi" target='_aboutme' rel="noreferrer"  ><Button onClick={onClose} variant={'ghost'}>About ME</Button></a>

                  <a href="https://linkedin.com/in/nik4furi" target='_contact' rel="noreferrer"  ><Button onClick={onClose} variant={'ghost'}>Contact ME</Button></a>
                </VStack>
              </DrawerBody>

              <DrawerFooter>
                {isAuthenticated ?
                  <>
                    <VStack justifyContent={['center', 'space-between']} w='full'>
                      <HStack my='2' justifyContent={['center', 'space-evenly']} w='full' >

                        <Link to={'/logout'}> <Buttons handleClick={onClose} title={'Logout'} /></Link>

                      </HStack>
                     
                    </VStack>
                  </>
                  :
                  <Link to={'/'}> <Buttons handleClick={onClose} title={'Login'} /></Link>
                }


              </DrawerFooter>
            </DrawerContent>
          </Drawer>
        </Box>
      </section>
    </>
  )
}

export default Header