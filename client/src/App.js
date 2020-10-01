import React,{useState} from 'react';
import './App.css';
import { useQuery, useMutation } from '@apollo/react-hooks';
import gql from "graphql-tag";


const READ_TODOS = gql`
  query todos{
    todos {
      id
      text
	  productname
	  producttype
	  productcategory
	  productsubcategory
      completed
    }
  }
`;

const CREATE_TODO = gql`
  mutation CreateTodo($text: String!,$productname: String!,$producttype : String!,$productcategory:String!,$productsubcategory:String!) {
    createTodo(text: $text,productname:$productname,producttype:$producttype,productcategory:$productcategory,productsubcategory:$productsubcategory)
  }
`;

const REMOVE_TODO = gql`
  mutation RemoveTodo($id: String!) {
    removeTodo(id: $id)
  }
`;

const UPDATE_TODO = gql`
  mutation UpdateTodo($id: String!,$text: String!,$productname: String!,$producttype : String!,$productcategory:String!,$productsubcategory:String!) {
    updateTodo(id: $id,text: $text,productname:$productname,producttype:$producttype,productcategory:$productcategory,productsubcategory:$productsubcategory)
  }
`;

function App() {
	const [text,setText] = useState([]);
	const [id,setId] = useState(0);
	const [product,setProductName] = useState([]);
	const [type,setProductType] = useState([]);
	const [category,setCategory] = useState([]);
	const [subcategory,setSubCategory] = useState([]);
	
  let input;
  const { data, loading, error } = useQuery(READ_TODOS);
  const [createTodo] = useMutation(CREATE_TODO);
  const [deleteTodo] = useMutation(REMOVE_TODO);
  const [updateTodo] = useMutation(UPDATE_TODO);
	const handleSubmit=()=>{
		
		if(id == 0){
			
			createTodo({ variables: { text: text,productname : product,producttype :type ,productcategory:category,productsubcategory:subcategory} });
		}else{
			
			updateTodo({ variables: { id: id,text: text,productname : product,producttype :type ,productcategory:category,productsubcategory:subcategory } });
		}
	}
	const updateProduct=(id)=>{
		data.todos.map((todo)=>{
			if(todo.id === id){
				setText(todo.text);
				setId(todo.id);
				setProductName(todo.productname);
				setProductType(todo.producttype);
				setCategory(todo.productcategory);
				setSubCategory(todo.productsubcategory);
				
			}
			return 0;
		});
	}
	const Cancel=()=>{
				setText('');
				setId(0);
				setProductName('');
				setProductType('');
				setCategory('');
				setSubCategory('');
	}
  if (loading) return <p>loading...</p>;
  if (error) return <p>ERROR</p>;
  if (!data) return <p>Not found</p>;

  return (
    <div className="app">
      <h3>Create Product/Update Product</h3>
      <form onSubmit={e => {
        e.preventDefault();
		handleSubmit();
        
        
        window.location.reload();
      }}>
		<input type="hidden" name="id" value={id}/> 
        
		<label>Product Name</label>
		<input className="form-control" value={product} name="productname"  type="text" placeholder="product name"  onChange={e => setProductName(e.target.value)}></input>
		<label>Product Quantity</label>
		<input className="form-control" value={type} name="producttype"  type="text" placeholder="Quantity"  onChange={e => setProductType(e.target.value)}></input>
        <label>SKU</label>
		<input className="form-control" value={text} name="text"  type="text" placeholder="SKU"  onChange={e => setText(e.target.value)}></input>
		 <label>Category</label>
		<input className="form-control" value={category} name="category"  type="text" placeholder="Category"  onChange={e => setCategory(e.target.value)}></input>
		 <label>Sub Category</label>
		<input className="form-control" value={subcategory} name="subcategory"  type="text" placeholder="Sub Category"  onChange={e => setSubCategory(e.target.value)}></input>
		<button className="btn btn-primary px-5 my-2" type="submit">Submit</button>
		<button className="btn btn-danger px-5 my-2" type="button" onClick={Cancel}>Cancel</button>
      </form>
      <table className="table table-striped">
		<tr>
			<td>Product Name</td>
			<td>Product Quantity</td>
			<td>Product Sku</td>
			<td>Product Category</td>
			<td>Product Sub Category</td>
			<td>Action</td>
		</tr>
        {data.todos.map((todo) =>
          <tr key={todo.id} className="w-100">
           
			<td>{ todo.productname }</td> 
			<td>{ todo.producttype }</td>
			 <td >{todo.text}</td> 
			<td>{ todo.productcategory }</td>
			<td>{ todo.productsubcategory }</td>
			<td>
            <button className="btn btn-sm btn-danger rounded-circle float-right" onClick={() => {
              deleteTodo({ variables: { id: todo.id } });
              window.location.reload();
            }}>X</button>
			
            <button className={`btn btn-sm float-right ${todo.completed ? "btn-success" : "btn-info"}`} onClick={() => {
              updateProduct(todo.id); //updateTodo({ variables: { id: todo.id } });
             // window.location.reload();
            }}>Edit</button></td>
          </tr>
        )}
      </table>
    </div>
  );
}

export default App;