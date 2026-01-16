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
          {/* <div className="modal-content">
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
          </div> */}
          <div className="modal-content border-0">
      <div className="modal-header bg-dark text-white">
        <h5 id="productModalLabel" className="modal-title">
          <span>新增產品</span>
        </h5>
        <button
          type="button"
          className="btn-close"
          data-bs-dismiss="modal"
          aria-label="Close"
          ></button>
      </div>
      <div className="modal-body">
        <div className="row">
          <div className="col-sm-4">
            <div className="mb-2">
              <div className="mb-3">
                <label htmlFor="imageUrl" className="form-label">
                  輸入圖片網址
                </label>
                <input
                  type="text"
                  id="imageUrl"
                  name="imageUrl"
                  className="form-control"
                  placeholder="請輸入圖片連結"
                  />
              </div>
              <img className="img-fluid" src={null} alt="主圖" />
            </div>
            <div>
              <div>
					      <label htmlFor="imageUrl" className="form-label">
					        輸入圖片網址
					      </label>
					      <input
					        type="text"
					        className="form-control"
					        // placeholder={`圖片網址${index + 1}`}
					      />
					      <img
                  className="img-fluid"
                  src={null}
                  // alt={`副圖${index + 1}`}
                />
					    </div>
              <button className="btn btn-outline-primary btn-sm d-block w-100">
                新增圖片
              </button>
            </div>
            <div>
              <button className="btn btn-outline-danger btn-sm d-block w-100">
                刪除圖片
              </button>
            </div>
          </div>
          <div className="col-sm-8">
            <div className="mb-3">
              <label htmlFor="title" className="form-label">標題</label>
              <input
                name="title"
                id="title"
                type="text"
                className="form-control"
                placeholder="請輸入標題"
                />
            </div>

            <div className="row">
              <div className="mb-3 col-md-6">
                <label htmlFor="category" className="form-label">分類</label>
                <input
                  name="category"
                  id="category"
                  type="text"
                  className="form-control"
                  placeholder="請輸入分類"
                  />
              </div>
              <div className="mb-3 col-md-6">
                <label htmlFor="unit" className="form-label">單位</label>
                <input
                  name="unit"
                  id="unit"
                  type="text"
                  className="form-control"
                  placeholder="請輸入單位"
                  />
              </div>
            </div>

            <div className="row">
              <div className="mb-3 col-md-6">
                <label htmlFor="origin_price" className="form-label">原價</label>
                <input
                  name="origin_price"
                  id="origin_price"
                  type="number"
                  min="0"
                  className="form-control"
                  placeholder="請輸入原價"
                  />
              </div>
              <div className="mb-3 col-md-6">
                <label htmlFor="price" className="form-label">售價</label>
                <input
                  name="price"
                  id="price"
                  type="number"
                  min="0"
                  className="form-control"
                  placeholder="請輸入售價"
                  />
              </div>
            </div>
            <hr />

            <div className="mb-3">
              <label htmlFor="description" className="form-label">產品描述</label>
              <textarea
                name="description"
                id="description"
                className="form-control"
                placeholder="請輸入產品描述"
                ></textarea>
            </div>
            <div className="mb-3">
              <label htmlFor="content" className="form-label">說明內容</label>
              <textarea
                name="content"
                id="content"
                className="form-control"
                placeholder="請輸入說明內容"
                ></textarea>
            </div>
            <div className="mb-3">
              <div className="form-check">
                <input
                  name="is_enabled"
                  id="is_enabled"
                  className="form-check-input"
                  type="checkbox"
                  />
                <label className="form-check-label" htmlFor="is_enabled">
                  是否啟用
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="modal-footer">
        <button
          type="button"
          className="btn btn-outline-secondary"
          data-bs-dismiss="modal"
          onClick={() => closeModal()}
          >
          取消
        </button>
        <button type="button" className="btn btn-primary">確認</button>
      </div>
    </div>
        </div>
      </div>
    </>)
}

export default App
