import React, { Component } from "react";
import faker from "faker";
import Pagination, { PageNavigation } from "./Pagination";

import "./normalize.css";
import "./Catalog.css";

import whiteLogo from "./img/globoticket-horizontal-white.svg";
import cartImg from "./img/cart.svg";

import thumbNail1 from "./img/shutterstock_415922566_thumbnail_1.jpg";
import thumbNail2 from "./img/shutterstock_606456248_thumbnail_2.jpg";
import thumbNail3 from "./img/shutterstock_1746589040_thumbnail_3.jpg";

const thumbNails = [thumbNail1, thumbNail2, thumbNail3];

const generateEventData = (n) => {
  const data = [];
  for (let i = 0; i < n; i++) {
    data.push({
      name: faker.lorem.words(2),
      thumbNail: i % thumbNails.length,
      dateTime: faker.date.future().toString(),
      artist: faker.name.findName(),
      price: faker.random.number(100) + 20,
      tickets: faker.random.number(100) + 40,
    });
  }
  return data;
};

const Event = ({ data }) => {
  const { thumbNail, dateTime, name, artist, price, tickets } = data;
  return (
    <tr>
      <td className="event-image">
        <img alt="thumbnail" src={thumbNails[thumbNail]} />
      </td>
      <td className="event-date">{dateTime}</td>
      <td className="event-name">{name}</td>
      <td className="event-artist">{artist}</td>
      <td className="event-price">${price}</td>
      <td className="event-price">{tickets}</td>
      <td className="event-purchase-button">
        <button>Purchase Details</button>
      </td>
    </tr>
  );
};

export default class Catalog extends Component {
  state = {
    eventData: generateEventData(5),
    currentPage: 0,
    artistFilter: "",
  };

  constructor(props) {
    super(props);
    this.generatorNumberInput = React.createRef();
    this.filterInput = React.createRef();
    this.bottomDetector = React.createRef();
  }

  componentDisMount() {
    var options = {
      threshold: 1.0,
    };

    const observer = new IntersectionObserver();
  }

  generateEvents() {
    this.setState({
      eventData: generateEventData(
        parseInt(this.generatorNumberInput.current.value),
      ),
    });
  }

  previousPageHandler() {
    this.setState({ currentPage: this.state.currentPage - 1 });
  }

  nextPageHandler() {
    this.setState({ currentPage: this.state.currentPage + 1 });
  }

  setFilter() {
    this.setState({ artistFilter: this.filterInput.current.value });
  }

  render() {
    var filteredEvents;

    if (!this.state.artistFilter) {
      filteredEvents = this.state.eventData;
    } else {
      filteredEvents = this.state.eventData.filter(
        (ed) =>
          ed.artist
            .toLowerCase()
            .indexOf(this.state.artistFilter.toLowerCase()) >= 0,
      );
    }

    const eventsPagination = new Pagination(filteredEvents, 1000);
    console.log(
      "#events: ",
      eventsPagination.getPage(this.state.currentPage).length,
    );

    return (
      <div className="container">
        <header>
          <h1>
            <img alt="logo" src={whiteLogo} />
          </h1>
          <div className="header-cart">
            <img alt="cart" src={cartImg} />
          </div>
        </header>
        <section>
          <div className="search-bar">
            <button onClick={this.setFilter.bind(this)}>Filter :</button>
            <input
              onChange={this.setFilter.bind(this)}
              ref={this.filterInput}
            ></input>
          </div>
          <div className="table">
            <table>
              <thead>
                <tr>
                  <th scope="col">&nbsp;</th>
                  <th scope="col">Date</th>
                  <th scope="col">Name</th>
                  <th scope="col">Artist</th>
                  <th scope="col">Price</th>
                  <th scope="col">Tickets Left</th>
                  <th scope="col">&nbsp;</th>
                </tr>
              </thead>
              <tbody>
                {eventsPagination
                  .getPage(this.state.currentPage)
                  .map((ed, i) => (
                    <Event data={ed} key={i} />
                  ))}
              </tbody>
            </table>
            <PageNavigation
              previousPageHandler={this.previousPageHandler.bind(this)}
              nextPageHandler={this.nextPageHandler.bind(this)}
              currentPage={this.state.currentPage}
              totalPages={eventsPagination.getTotalPages()}
            ></PageNavigation>
          </div>
          <input type="number" ref={this.generatorNumberInput}></input>
          <button onClick={this.generateEvents.bind(this)}>Add</button>
        </section>
      </div>
    );
  }
}
