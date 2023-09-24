import React, { Component } from "react";
import faker from "faker";
import Pagination from "./Pagination";
import AutoSizer from "react-virtualized-auto-sizer";
import { FixedSizeList as List } from "react-window";

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

const eventRowHeight = 100;

const Event = ({ data, style }) => {
  const { thumbNail, dateTime, name, artist, price, tickets } = data;
  return (
    <div className="table-row" style={{ height: eventRowHeight, ...style }}>
      <div className="table-row-data event-image">
        <img alt="thumbnail" src={thumbNails[thumbNail]} />
      </div>
      <div className="table-row-data event-date">{dateTime}</div>
      <div className="table-row-data event-name">{name}</div>
      <div className=" table-row-data event-artist">{artist}</div>
      <div className="table-row-data event-price">${price}</div>
      <div className="table-row-data event-price">{tickets}</div>
      <div className="table-row-data event-purchase-button">
        <button>Purchase Details</button>
      </div>
    </div>
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
  }

  virtualizedEvent({ index, style, key }) {
    if (!this.filteredEvents || this.filteredEvents.length === 0) {
      return null;
    }

    return <Event data={this.filteredEvents[index]} key={key} style={style} />;
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
      this.filteredEvents = this.state.eventData;
    } else {
      this.filteredEvents = this.state.eventData.filter(
        (ed) =>
          ed.artist
            .toLowerCase()
            .indexOf(this.state.artistFilter.toLowerCase()) >= 0,
      );
    }

    const eventsPagination = new Pagination(filteredEvents, 1);
    this.totalPages = eventsPagination.getTotalPages();

    /*console.log(
      "#events: ",
      eventsPagination.getPage(this.state.currentPage).length,
    );*/

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
            <table className="table">
              <div className="table-row">
                <div className="table-row-data event-image">&nbsp;</div>
                <div className="table-row-data event-date">Date</div>
                <div className="table-row-data event-name">Name</div>
                <div className="table-row-data event-artist">Artist</div>
                <div className="table-row-data event-price">Price</div>
                <div className="table-row-data event-price">Tickets Left</div>
                <div className="table-row-data">&nbsp;</div>
              </div>
              <div className="table-body">
                <AutoSizer width="100%">
                  {({ height, width }) => {
                    console.log("AutoSizer", height, width);
                    return (
                      <List
                        height={height}
                        width={width}
                        itemCount={this.filteredEvents.length}
                        itemSize={eventRowHeight}
                      >
                        {this.virtualizedEvent.bind(this)}
                      </List>
                    );
                  }}
                </AutoSizer>
              </div>
            </table>
          </div>
          <input type="number" ref={this.generatorNumberInput}></input>
          <button onClick={this.generateEvents.bind(this)}>Add</button>
        </section>
      </div>
    );
  }
}
