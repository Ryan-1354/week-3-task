import { useState } from 'react'

// 引入axios
import axios from "axios";
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
    getProducts();
    setIsAuth(true);//只要api打成功不管帳密對不對都登入成功
  } catch(err){
    setIsAuth(false);
    alert(err.response);
  }
}

const checkLogin= async()=>{
try{
  const res=await axios.post(`${API_BASE}/v2/api/user/check`);
  const token = document.cookie
  .split("; ")
  .find((row) => row.startsWith("hexToken="))
  ?.split("=")[1];
  alert(`登入狀態${res.data.success}`);
}catch(err){
}
}

  return (
    isAuth? (
      <>
      <button
      className="btn btn-danger mb-5"
      type="button"
      onClick={()=>checkLogin()}>
      確認是否登入
      </button>
 <div className="row mt-5">
            <div className='col-6'>
                <h2>產品列表</h2>
                <table className="table">
                    <thead>
                        <tr>
                        <th scope="col">產品名稱</th>
                        <th scope="col">原價</th>
                        <th scope="col">售價</th>
                        <th scope="col">是否啟用</th>
                        <th scope="col">查看細節</th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.map(item=>(
                        <tr key={item.id}>
                        {/* <th scope="row">1</th> */}
                        <td>{item.title}</td>
                        <td>{item.origin_price}</td>
                        <td>{item.price}</td>
                        <td>{item.is_enabled ? '啟用':'未啟用'}</td>
                        <td><button type="button" className="btn btn-primary" onClick={()=>setTempProduct(item)}>查看</button></td>
                        </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <div className='col-5'>
                <h2>產品明細</h2>
                {tempProduct ? 
                    <div className="card">
                    <img src={tempProduct.imageUrl} className="card-img-top" alt={tempProduct.title}/>
                    <div className="card-body">
                        <h5 className="card-title">{tempProduct.title}</h5>
                        <p className="card-text">商品描述：{tempProduct.description}</p>
                        <p className="card-text">{tempProduct.content}</p>
                        <p className="d-flex align-items-end">價格：<del className='fs-6 text-secondary'>{tempProduct.origin_price}</del>元 / {tempProduct.price}元</p>
                        <h5 className="card-text d-flex flex-wrap">更多圖片：</h5>
                        <div className="d-flex flex-wrap">
                            {tempProduct.imagesUrl.map((item)=>(
                            <img key={item.id} src={item} alt={item.title}/>
                            ))}
                        </div>
                    </div>
                </div>
                 : <p>選擇商品查看詳情</p>}
            </div>
        </div>
            </>
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
    </div>) 
    )
}

export default App
