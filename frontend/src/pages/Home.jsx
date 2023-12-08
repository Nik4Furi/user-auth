import React from 'react'

//Chakra UI Components
import { Text, Container, Heading, Stack, VStack, Box } from '@chakra-ui/react'


//-------------- Images/Icons Container----------------------X
import { BsGithub } from 'react-icons/bs'


//Components Stuff
import TextHighlight from '../components/Layout/TextHighlight'


function Home({ user }) {


  return (
    <>
      <section id="Home">

        <Container maxW={'container.lg'} mt={'5'} >

          <Stack my={['10', '3']} direction={["column-reverse", "row"]} minH={'57vh'} >

            <VStack >
              <Heading> Welcome back, <TextHighlight title={user.name} colorscheme='yellow' size='xl' />   </Heading>
              <Text>Have a good day to start something on that, please checkout my <a href="https://github.com/nik4furi" style={{color:'salmon'}} target="_blank" rel="noopener noreferrer">github</a>  and linkedin profile, or also can choose any of one project form github, and start to contribute on that</Text>



            </VStack>

            <Box >
              <BsGithub color='purple' size={'70'} />
            </Box>

          </Stack>



        </Container>



      </section>
    </>
  )
}

export default Home