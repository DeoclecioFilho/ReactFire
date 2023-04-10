import { db, auth} from './firebaseconnection'
import './app.css';
import { useEffect, useState } from 'react';
import { doc, setDoc, collection, addDoc, getDoc, getDocs, updateDoc, deleteDoc, onSnapshot } from 'firebase/firestore';
import { createUserWithEmailAndPassword, onAuthStateChanged, signInWithEmailAndPassword, signOut } from 'firebase/auth';


function App() {
  const [titulo, setTitulo] = useState('');
  const [autor, setAutor] = useState('');
  const [posts, setPosts] = useState([]);
  const [idPost, setIdPost] = useState('');

  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');

  const [user, setUser] = useState(false)
  const [userDetail, setUserDetail] = useState({});

  useEffect(() =>{
    async function loadPosts(){
      const unsub = onSnapshot(collection(db, "posts"), (snapshot) =>{
        let listaPosts = [];

        snapshot.forEach((doc) => {
          listaPosts.push({
            id: doc.id,
            titulo: doc.data().titulo,
            autor: doc.data().autor,
          })
        })
        setPosts(listaPosts);
      })
    }
    loadPosts();
  }, [])

  useEffect(() => {
    async function checkLogin(){
      onAuthStateChanged(auth, (user) =>{
        if(user){
          console.log(user)
          setUser(true)
          setUserDetail({
            uid: user.uid,
            email: user.email
          })
        }else{
          setUser(false)
          setUserDetail({})
        }
      })
    }
    checkLogin();
  }, [])

  async function handleAdd(){
/*       await setDoc(doc(db, "posts", "12345"), {*/

      await addDoc(collection(db, "posts"), {
        titulo:titulo,
        autor: autor,
      }) 
      .then(() => {
        console.log("Dados registrados no banco")
        setAutor('')
        setTitulo('')
      })
      .catch((error) => {
        console.log("erro: " +error)
      })
  }  
  
  async function editarPost(){
    const docRef = doc(db, "posts", idPost)
      await updateDoc(docRef, {
        titulo:titulo,
        autor: autor,
      }) 
      .then(() => {
        console.log("Dados atualizados no banco")
        setIdPost('')
        setTitulo('')
        setAutor('')
      })
      .catch((error) => {
        console.log("erro ao atualizar: " +error)
      })
  }



/**
 * Busca um post por vez
 */
  async function buscarPost(){
    const postRef = doc(db, "posts", idPost)

    await getDoc(postRef)
    .then((snapshot) => {
      
      setTitulo('')
      setAutor('')
      setTitulo(snapshot.data().titulo)
      setAutor(snapshot.data().autor)
      
      console.log("Dados importados")
    })
    .catch((error) => {
      console.log("erro ao buscar: " + error)
    })
    }

    /**
     * Busca todos os posts
     */
    async function listarPosts(){
      const postsRef = collection(db, "posts")
      await getDocs(postsRef)
      .then((snapshot) => {
        let lista = [];

        snapshot.forEach((doc) => {
          lista.push({
            id: doc.id,
            titulo: doc.data().titulo,
            autor: doc.data().autor,
          })
        })
        setPosts(lista);
      })
      .catch((error) => {
        console.log("Deu erro: " + error)
      })

    }

    
  async function excluirPost(id){
    const docRef = doc(db, "posts", id)
      await deleteDoc(docRef) 
      .then(() => {
        console.log("Post excluido com sucesso!")  
       listarPosts()
      })
      .catch((error) => {
        console.log("erro ao excluir: " +error)
      })
    
      console.log("Id excluido: " +id)
  }

  async function novoUsuario(){
    await createUserWithEmailAndPassword(auth, email, senha)

    .then((value) => {
      console.log("Cadastrado com sucesso!")  
      console.log(value);
      setEmail('')
      setSenha('')
    })
    .catch((error) => {

      if(error.code === 'auth/weak-password'){
        alert ('Senha muito fraca.')
      }else if(error.code === 'auth/email-already-in-use'){
        alert('email já existe!')
      }
      console.log("Erro ao cadastrar: " + error)
    })
  }

  async function logarUsuario(){
    await signInWithEmailAndPassword(auth, email, senha)

    .then((value) => {
      console.log("Usuário logado com sucesso!")  
      console.log(value.user);

      setUserDetail({
        uid:value.user.uid,
        email:value.user.email,
      })
      setUser(true);

      setEmail('')
      setSenha('')
    })
    .catch((error) => {
      console.log("Erro ao logar: " +error)
    })
  }

  async function fazerLogout(){
    await signOut(auth)
    setUser(false);
    setUserDetail({})
  }

  return (
    <div className="App"><h1> Firebase</h1>

    { user && (
      <div> 
        <strong> SEJA BEM VINDO(A) (Você está logado!)</strong> <br/>
        <span> ID: {userDetail.uid} <br/> Email: {userDetail.email} </span><br/>
        <button onClick={fazerLogout}>Logout</button>
        <br/><br/>
      </div>
    )}

    <div className='container'>

      <h2>USUÁRIOS</h2>
      <label>Email</label>
      <input
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder='Digite um email'
      /> <br/>

            <label>Senha</label>
      <input
        value={senha}
        type='password'
        onChange={(e) => setSenha(e.target.value)}
        placeholder='Informe sua senha'
      /> <br/>
      <button onClick={novoUsuario}>Cadastrar</button><br/> 
      <button onClick={logarUsuario}>Logar</button>
    </div>

    <br/><br/> <hr/>
    <br/>
    <div className='container'>
    <h2>POSTS</h2>
      <label> ID do Post:</label>
      <input
      placeholder='Digite o ID do post'
      value={idPost}
      onChange={(e) => setIdPost(e.target.value)}
      /><br/>
   
     


      <label> Título:</label>
      <textarea 
      type='text' 
      placeholder='Digite o título'
      value ={titulo}
      onChange={(e) => setTitulo(e.target.value) }
      />

      <label>Autor</label>
      <input 
      type='text' 
      placeholder='Autor do post' 
      value={autor}
      onChange={(e) => setAutor(e.target.value) }
      /><br/>

      <button onClick={handleAdd}>Cadastrar</button><br/>
      <button onClick={editarPost}>Atualizar post</button><br/>
      
      <button onClick={buscarPost}>Buscar post</button><br/>
      
      <button onClick={listarPosts}>Listar posts</button><br/><br/>

<strong>POSTS</strong>
      
      <ul>
        {posts.map((post) =>{
          return(
            <li key={post.id}>
              <strong>ID: {post.id}</strong> <br/>
              <span>Titulo: {post.titulo}</span> <br/>
              <span>Autor: {post.autor}</span><br/>
              <button onClick={() => excluirPost(post.id)}>Excluir</button><br/><br/>
            </li>
          )
        })}
      </ul>

    </div>
    </div>
  );
}

export default App;
