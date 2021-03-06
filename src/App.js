import React, { Component } from 'react'
import axios from 'axios'
// Maps api key : AIzaSyDjPXB1ZTe7m6ns_8Ma4KmsaSwCR2_KzjU
// client id for 4square: JCMVWOYFE0FQTXMIMNW0TR5MQYTPCH0NYTRAAYSSDSFFZZAP
// client secret for 4square: MOUNE5JZDOBRLV1TDFH3OYMFQO2LFCE24OSVR5Z53NYGQXWD
class App extends Component {


  state = {
    venues: []
  }

  componentDidMount() {
    this.getVenues()
  }

  renderMap = () => {
    loadScript("https://maps.googleapis.com/maps/api/js?key=AIzaSyDjPXB1ZTe7m6ns_8Ma4KmsaSwCR2_KzjU&callback=initMap")
    window.initMap = this.initMap
  }

  getVenues = () => {
    const endPoint = "https://api.foursquare.com/v2/venues/explore?"
    const parameters = {
      client_id: "JCMVWOYFE0FQTXMIMNW0TR5MQYTPCH0NYTRAAYSSDSFFZZAP",
      client_secret: "MOUNE5JZDOBRLV1TDFH3OYMFQO2LFCE24OSVR5Z53NYGQXWD",
      query: "developers",
      near: "st. petersburg, fl",
      limit: "1",
      v: "20182507"
    }

    axios.get(endPoint + new URLSearchParams(parameters))
      .then(response => {
        this.setState({
          venues: response.data.response.groups[0].items
        }, this.renderMap())
      })
      .catch(error => {
        console.log("ERROR!! " + error)
      })

  }

  initMap = () => {

    // Create A Map
    let map = new window.google.maps.Map(document.getElementById('map'), {
      center: {lat: 27.7676, lng: -82.6403},
      zoom: 10
    })

    // Create An InfoWindow
    let infowindow = new window.google.maps.InfoWindow()

    // Display Dynamic Markers
    this.state.venues.map(myVenue => {

      let contentString = `${myVenue.venue.name}`

      // Create A Marker
      let marker = new window.google.maps.Marker({
        position: {lat: myVenue.venue.location.lat , lng: myVenue.venue.location.lng},
        map: map,
        title: myVenue.venue.name
      })

      // Click on A Marker!
      marker.addListener('click', function() {

        // Change the content
        infowindow.setContent(contentString)

        // Open An InfoWindow
        infowindow.open(map, marker)
      })

    })

    

  }

  render() {
    return (
      <main>
        <h1>Maps</h1>
        <div id="map"></div>
      </main>
    )
  }
}

function loadScript(url) {
  let index  = window.document.getElementsByTagName("script")[0]
  let script = window.document.createElement("script")
  script.src = url
  script.async = true
  script.defer = true
  index.parentNode.insertBefore(script, index)
}

export default App;