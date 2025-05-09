'use client'

import "../checkout/style.css";
import { useSelector } from "react-redux";

export default function Page() {
  const cartItems = useSelector((state) => state.cart.items);

  return (
    <div>
      <header>
        <div className="container">
          <div className="navigation">
            <div className="logo">
              <i className="icon icon-basket"></i>shop42
            </div>
            <div className="secure">
              <i className="icon icon-shield"></i>
              <span>Secure Checkout</span>
            </div>
          </div>
          <div className="notification">Complete Your Purchase</div>
        </div>
      </header>
      <section className="content">
        <div className="container"></div>
        <div className="details shadow">
          <div className="details__item">
            <div className="item__image">
              <img
                className="iphone"
                src="https://www.apple.com/v/iphone/compare/k/images/overview/compare_iphoneXSmax_silver_large.jpg"
                alt=""
              />
            </div>
            <div className="space-y-6">
              {cartItems.map((item) => (
                <div key={item._id} className="item__details">
                  <div className="item__title">{item.name}</div>
                  <div className="item__price">{item.price} £</div>
                  <div className="item__quantity">
                    Quantity: {item.quantity}
                  </div>
                  <div className="item__description">
                    <ul>
                      {item.descriptionList?.map((desc, index) => (
                        <li key={index}>{desc}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
            {/* <div className="item__details">
              <div className="item__title">Iphone X</div>
              <div className="item__price">649,99 £</div>
              <div className="item__quantity">Quantity: 1</div>
              <div className="item__description">
                <ul>
                  <li>Super fast and power efficient</li>
                  <li>A lot of fast memory</li>
                  <li>High resolution camera</li>
                  <li>Smart tools for health and traveling and more</li>
                  <li>
                    Share your games and achievements with your friends via
                    Group Play
                  </li>
                </ul>
              </div>
            </div> */}
          </div>
        </div>
        <div className="discount"></div>

        <div className="container">
          <div className="payment">
            <div className="payment__title">Payment Method</div>
            <div className="payment__types">
              <div className="payment__type payment__type--cc active">
                <i className="icon icon-credit-card"></i>Credit Card
              </div>
              <div className="payment__type payment__type--paypal">
                <i className="icon icon-paypal"></i>Paypal
              </div>
              <div className="payment__type payment__type--paypal">
                <i className="icon icon-wallet"></i>SEPA
              </div>
              <div className="payment__type payment__type--paypal">
                <i className="icon icon-note"></i>Invoice
              </div>
            </div>

            <div className="payment__info">
              <div className="payment__cc">
                <div className="payment__title">
                  <i className="icon icon-user"></i>Personal Information
                </div>
                <form>
                  <div className="form__cc">
                    <div className="row">
                      <div className="field">
                        <div className="title">Credit Card Number</div>
                        <input
                          type="text"
                          className="input txt text-validated"
                          value="4542 9931 9292 2293"
                        />
                      </div>
                    </div>
                    <div className="row">
                      <div className="field small">
                        <div className="title">Expiry Date</div>
                        <select className="input ddl">
                          <option selected>01</option>
                          <option>02</option>
                          <option>03</option>
                          <option>04</option>
                          <option>05</option>
                          <option>06</option>
                          <option>07</option>
                          <option>08</option>
                          <option>09</option>
                          <option>10</option>
                          <option>11</option>
                          <option>12</option>
                        </select>
                        <select className="input ddl">
                          <option>01</option>
                          <option>02</option>
                          <option>03</option>
                          <option>04</option>
                          <option>05</option>
                          <option>06</option>
                          <option>07</option>
                          <option>08</option>
                          <option>09</option>
                          <option>10</option>
                          <option>11</option>
                          <option>12</option>
                          <option>13</option>
                          <option>14</option>
                          <option>15</option>
                          <option selected>16</option>
                          <option>17</option>
                          <option>18</option>
                          <option>19</option>
                          <option>20</option>
                          <option>21</option>
                          <option>22</option>
                          <option>23</option>
                          <option>24</option>
                          <option>25</option>
                          <option>26</option>
                          <option>27</option>
                          <option>28</option>
                          <option>29</option>
                          <option>30</option>
                          <option>31</option>
                        </select>
                      </div>
                      <div className="field small">
                        <div className="title">
                          CVV Code
                          <span className="numberCircle">?</span>
                        </div>
                        <input type="text" className="input txt" />
                      </div>
                    </div>
                    <div className="row">
                      <div className="field">
                        <div className="title">Name on Card</div>
                        <input type="text" className="input txt" />
                      </div>
                    </div>
                  </div>
                </form>
              </div>
              <div className="payment__shipping">
                <div className="payment__title">
                  <i className="icon icon-plane"></i> Shiping Information
                </div>
                <div className="details__user">
                  <div className="user__name">
                    John Doe
                    <br /> 13/03/1980
                  </div>
                  <div className="user__address">
                    Shipping Address: 22 Street, Address
                    <br />
                    Country
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="container" />
        <div className="actions">
          <a href="#" className="btn action__submit">
            Place your Order
            <i className="icon icon-arrow-right-circle"></i>
          </a>
          <a href="#" className="backBtn">
            Go Back to Shop
          </a>
        </div>
      </section>
    </div>
  );
}
