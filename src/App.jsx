import { useState, useEffect, useRef } from 'react'

// 引入axios
import axios from "axios";
import * as bootstrap from 'bootstrap';
const API_BASE = import.meta.env.VITE_API_BASE;
const API_PATH = import.meta.env.VITE_API_PATH;


// 引入css
import "./assets/style.css";



function App() {
  //管理登入資訊
  const [formData, setFormData]=useState({
    username:'1354ark@gmail.com',
    password:'hexschool666',
  })
  //管理登入狀態
  const [isAuth, setIsAuth]= useState(false)
  // 表單輸入處理
  const handleInputChange=e=>{
    const {name, value}=e.target;
    setFormData(preData=>({
      ...preData,
      [name]:value,
    }))
  }
  
  const [products, setProducts]=useState([]);
  const[tempProduct, setTempProduct]=useState();
  const productModalRef=useRef(null);
  
  //call 取得產品API
  const getProducts=async ()=>{
    try{
      const response = await axios.get(`${API_BASE}/v2/api/${API_PATH}/admin/products`);
      setProducts(response.data.products);

    }catch(err){
      console.log(err.response);
    }
  }

  //call 登入API
const onSubmit= async (e)=>{
  // console.log(`${API_BASE}/v2/admin/signin`); 驗證路徑正確
  try{
    e.preventDefault();
    const response=await axios.post(`${API_BASE}/v2/admin/signin`, formData);
    const {token, expired}=response.data;
    document.cookie = `hexToken=${token};expires=${new Date(expired)};`;
    // 之後用 axios 發出的所有請求，都會自動帶上 Authorization header
    axios.defaults.headers.common['Authorization'] = `${token}`;
    setIsAuth(true);//只要api打成功不管帳密對不對都登入成功
    getProducts();
  } catch(err){
    setIsAuth(false);
    alert(err.response);
  }
}


useEffect(()=>{
  const token = document.cookie
  .split("; ")
  .find((row) => row.startsWith("hexToken="))
  ?.split("=")[1];
  if(token){
    axios.defaults.headers.common['Authorization'] = `${token}`;
  };

  productModalRef.current=new bootstrap.Modal('#productModal', {
  keyboard: false
})

  const checkLogin= async()=>{
    try{
      const res=await axios.post(`${API_BASE}/v2/api/user/check`);
      console.log(`登入狀態${res.data.success}`);
      setIsAuth(true);
      getProducts();
    }catch(err){
    }
  };
  checkLogin();
}, [])

const openModal=()=>{
  productModalRef.current.show()
}
const closeModal=()=>{
  productModalRef.current.hide()
}

  return (
    <>
    {isAuth? (
      <div className="container mt-5">
                <h2>產品列表</h2>
                 {/* 新增產品按鈕 */}
                <div className="text-end mt-4">
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={()=>openModal()}
                    >
                    建立新的產品
                  </button>
                </div>
                <table className="table mt-5">
                    <thead>
                        <tr>
                        <th scope="col">分類</th>
                        <th scope="col">產品名稱</th>
                        <th scope="col">原價</th>
                        <th scope="col">售價</th>
                        <th scope="col">是否啟用</th>
                        <th scope="col">編輯</th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.map(item=>(
                        <tr key={item.id}>
                        {/* <th scope="row">1</th> */}
                        <td>{item.category}</td>
                        <td>{item.title}</td>
                        <td>{item.origin_price}</td>
                        <td>{item.price}</td>
                        <td className={item.is_enabled && 'text-success'}>{item.is_enabled ? '啟用':'未啟用'}</td>
                        <td><div className="btn-group" role="group" aria-label="Basic example">
                              <button type="button" className="btn btn-outline-primary btn-sm">編輯</button>
                              <button type="button" className="btn btn-outline-danger btn-sm">刪除</button>
                            </div>
                        </td>
                        </tr>
                        ))}
                    </tbody>
                </table>
      </div>
             )
             
    : (
    <div className="container login"> 
    <h1>請先登入</h1>
    <form className='form-floating' onSubmit={e=>onSubmit(e)}>
      <div className="form-floating mb-3">
        <input type="email" 
        className="form-control" 
        name="username" 
        placeholder="name@example.com" 
        value={formData.username}
        onChange={(e)=>handleInputChange(e)}/>
        <label htmlFor="username">Email address</label>
      </div>
        <div className="form-floating mb-3">
          <input type="password" 
          className="form-control" 
          name="password" 
          laceholder="Password" 
          value={formData.password}
          onChange={(e)=>handleInputChange(e)}/>
          <label htmlFor="password">Password</label>
      </div>
      <button type='submit' className='btn btn-primary w-100'>登入</button>
    </form>
    </div>)}
      <div ref={productModalRef} className="modal fade" id="productModal" tabIndex="-1" aria-labelledby="productModalLabel" aria-hidden="true">
        <div className="modal-dialog modal-xl">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="productModalLabel">Modal title</h1>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body">
              ...
            </div>
            <div className="modal-footer">
              <button  onClick={()=>closeModal()} type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
              <button type="button" className="btn btn-primary">Save changes</button>
            </div>
          </div>
        </div>
      </div>
    </>)
}

export default App
