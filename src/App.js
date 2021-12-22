
import axios from 'axios';
import { useEffect, useState } from 'react';


function App() {


  useEffect(async() => {
      getProductData();
  }, [])

  const [ProductData, setProductData] = useState(
    {
      SKUs: [],
      product: {},
      vendor: {}
    }
  );

  const getProductData = async () => {
    var productSlug = 'rntr-recruitment-only-product';
    var productApi = `https://app.getrntr.com/api/products/v2/by-location?url=${productSlug}`;
    try {
      const response = await axios.get(productApi);
      setProductData(response.data);
    }
    catch (err) {
      console.log(err)
    }
  }

  const printData = () => {
    console.log(ProductData);
  }

  return (

    <div className="App">
      <header className="App-header" >
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
        <p onClick={printData}>Samee</p>
      </header>
    </div>
  );
}

export default App;
