
import axios from 'axios';
import { useEffect, useState } from 'react';


function App() {


  useEffect(() => {
    (async () => {
      getProductData();
    })()
  }, [])


  const [ProductData, setProductData] = useState();
  const [SkuData, setSkuData] = useState([]);
  const [productImages, setproductImages] = useState([]);



  const getSku = async (sku) => {
    var skuApi = `https://app.getrntr.com/api/skus/${sku}/availability/distribution`;
    try {
      const response = await axios.get(skuApi);
      setSkuData(response.data);
    }
    catch (err) {
      console.log(err);
    }
  }

  const getImage = (image) => {
    image.map((image_id) => {
      var imageApi = `https://app.getrntr.com/api/media/${image_id}`;
      productImages.push(imageApi);
      setproductImages([...productImages]);
    });
  }

  const getProductData = async () => {
    var productSlug = 'rntr-recruitment-only-product';
    var productApi = `https://app.getrntr.com/api/products/v2/by-location?url=${productSlug}`;
    try {
      const response = await axios.get(productApi);
      setProductData(response.data);
      getSku(response.data.SKUs[0].strId);
      getImage(response.data.product.images);
    }
    catch (err) {
      console.log(err);
    }
  }

  const printData = () => {
    console.log(ProductData);
    console.log(SkuData);
    console.log(productImages);
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
