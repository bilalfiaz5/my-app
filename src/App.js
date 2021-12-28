import axios from 'axios';
import { Fragment, useEffect, useState } from 'react';
import Data from './Data';
import './styles/index.css';


function App() {

  const [ProductData, setProductData] = useState();
  const [productImages, setproductImages] = useState([]);
  const [loading, setloading] = useState(false);

  // Get the all data from product Api using async when we get status then allow the loading of page
  useEffect(() => {
    (async () => {
      let status = await getProductData();
      if (status === 200) {
        setloading(true);
      }
    })()
  }, [])

  // get the image from Api using the id and setting the image url using states
  const getImage = (image) => {
    image.map((image_id) => {
      var imageApi = `https://app.getrntr.com/api/media/${image_id}`;
      productImages.push(imageApi);
      setproductImages([...productImages]);
    });
  }

    // get the product data from Api using the product slug and after all images url  and saving the data in states
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

  return (
    <Fragment>
      {/* Display the page after we get the data from Api */}
      {loading ? (
        <div className="container">
          <div className="imgBx">
          {/* Display the First image that is get from the image APi and display  */}
            <img src={productImages[0]} alt="Brand" />
          </div>
          <div className="details">
            <div className="content">
              {/* Display the data recieved from the Api */}
              <div className='h4--vendor'>{ProductData.vendor.title}</div>
              <div className='h1--title'>{ProductData.product.title}</div>
              {/* Display the remaining Information of Product */}
              <Data productInfo={ProductData} />
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
