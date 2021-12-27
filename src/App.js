
import axios from 'axios';
import { Fragment, useEffect, useState } from 'react';
import Buttons from './Buttons';
import './styles/index.css';


function App() {

  const [ProductData, setProductData] = useState();
  const [productImages, setproductImages] = useState([]);
  const [loading, setloading] = useState(false);

  useEffect(() => {
    (async () => {
      let status = await getProductData();
      if (status == 200) {
        setloading(true);
      }
    })()
  }, [])

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
      getImage(response.data.product.images);
      return response.status;
    }
    catch (err) {
      console.log(err);
    }
  }

  const printData = () => {
    console.log(ProductData);
    console.log(productImages);
  }

  return (
    <Fragment>
      {loading ? (
        <div className="container">
          <div className="imgBx">
            <img src={productImages[0]} onClick={printData} />
          </div>
          <div className="details">
            <div className="content">
            <div className='h4--vendor'>{ProductData.vendor.title}</div>
              <div className='h1--title'>{ProductData.product.title}</div>
              
              <Buttons productInfo={ProductData}/>
            </div>
          </div>
        </div>
      ) : (<p>No user found, please try again</p>
      )
      }
    </Fragment>

  );
}

export default App;
