import React, { Component } from "react";
import { Container, Row, Col } from "../../components/Grid";
import DesignCard from "../../components/DesignCard";
import designAPI from "../../utils/designAPI";
import dashboardAPI from "../../utils/dashboardAPI";
import userAPI from "../../utils/userAPI";
import CategoryForm from "../../components/CategoryForm/CategoryForm";
import DifficultyForm from "../../components/DifficultyForm/DifficultyForm";
// import RatingForm from "../../components/RatingForm/RatingForm";
import SortBy from "../../components/SortByForm/SortBy";
import { Form } from "react-bootstrap";
import "./style.css";

class Browse extends Component {
  constructor(props) {
    super(props)

    this.state = {
      publishedDesigns: [],
      sort: "Newest",
      category: "All",
      difficulty: "All",
      // rating: "",
      currentUser: "",
      usersFavorites: []
    }
  }

  componentDidMount() {
    userAPI
      .checkAuthStatus()
      .then(res => {
        this.setState({ currentUser: res.data.id }, () => this.checkUserFavorites());
      })
      .catch(err => {
        console.log(err);
      });
  }

  checkUserFavorites() {
    if (this.state.currentUser) {
      userAPI.findUserWithoutPopulation(this.state.currentUser)
        .then(res => {
          this.setState({ usersFavorites: res.data.favorites }, () => this.getAllPublishedDesigns())
        })
        .catch(err => {
          console.log(err);
        })
    }
    else {
      this.getAllPublishedDesigns();
    }
  }

  getAllPublishedDesigns = () => {
    designAPI
      .getAllPublishedDesigns(
        this.state.category,
        this.state.difficulty,
        this.state.sort
      )
      .then(res => {
        this.setState({
          publishedDesigns: res.data
        });
      })
      .catch(err => {
        console.log(err);
      });
  }

  favoriteEvent = (event, userId, designId) => {
    event.preventDefault();
    if (!this.state.currentUser || this.state.currentUser === "") {
      alert("You must be logged in to add a favorite!");
    }
    else {
      dashboardAPI.addFavorite(userId, designId)
        .then(res => {
          this.checkUserFavorites();
        })
        .catch(err => {
          console.log(err);
        })
    }
  }

  unfavoriteEvent = (event, userId, designId) => {
    event.preventDefault();
    if (!this.state.currentUser || this.state.currentUser === "") {
      alert("You must be logged in to add a favorite!");
    }
    else {
      dashboardAPI.removeFavorite(userId, designId)
        .then(res => {
          this.checkUserFavorites();
        })
        .catch(err => {
          console.log(err);
        })
    }
  }

  editEvent = (event, id) => {
    event.preventDefault();
    alert("Edit feature coming soon!");
  }

  // Change handlers for Browse forms
  handleSortChange = (event) => {
    event.preventDefault();
    this.setState({
      sort: event.target.value
    }, () => {
      this.checkUserFavorites();
    })
  }

  handleCategoryChange = (event) => {
    event.preventDefault();
    this.setState({
      category: event.target.value
    }, () => {
      this.checkUserFavorites();
    })
  }

  handleDifficultyChange = (event) => {
    event.preventDefault();
    this.setState({
      difficulty: event.target.value
    }, () => {
      this.checkUserFavorites();
    })
  }

  // handleRatingChange = (event) => {
  //     event.preventDefault();
  //     this.setState({
  //         rating: event.target.value
  //     }, () =>{
  //         // Verify state change with console.log()
  //         console.log(`Filtering results by ${this.state.rating}`);
  //     })
  // }

  render() {
    return (
      <Container styles="well p-3">
        {/* <Row styles="p-3 justify-content-center">
                    <h1>Browse</h1>
                </Row> */}
        <div className="row pt-2 pr-5 pl-5 mb-3 sticky-top bg-light rounded">
          <Col size="4">
            <SortBy onChange={this.handleSortChange}></SortBy>
          </Col>
          <Col size="4">
            <CategoryForm onChange={this.handleCategoryChange}></CategoryForm>
          </Col>
          <Col size="4">
            <DifficultyForm onChange={this.handleDifficultyChange}></DifficultyForm>
          </Col>
          {/* <RatingForm onChange={this.handleRatingChange}></RatingForm> */}
        </div>
        <div className="row">
          {!this.state.publishedDesigns.length > 0
            ? (
              <Col size="12">No published designs to display</Col>
            ) : (
              this.state.publishedDesigns.map(design => {
                console.log(this.state.publishedDesigns);
                return (
                  <div className="col-xl-4 col-lg-4 col-md-6 col-sm-12 col-xs-12" key={design._id + 1}>
                    <DesignCard
                      key={design._id}
                      id={design._id}
                      currentUser={this.state.currentUser}
                      img={design.canvasImage}
                      title={design.title}
                      description={design.description}
                      favorite={this.favoriteEvent}
                      unfavorite={this.unfavoriteEvent}
                      edit={this.editEvent}
                      page={"browse"}
                      isFavorite={this.state.usersFavorites.indexOf(design._id) > -1 ? true : false}
                    />
                  </div>
                );
              })
            )}
        </div>
      </Container>
    )
  }
};

export default Browse;