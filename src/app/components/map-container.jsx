import React from "react";
import { connect } from 'react-redux';
import { PropTypes } from 'prop-types';
import axios from "axios";

import TLToolbar from './app/toolbar';
import TLPanel from './app/panel';
import TLMap from './app/map';

import { requestContainers, receiveContainers, markersObjects } from '../actions';
import { osm_layers } from '../data/MapData';

const mapStateToProps = (state) => ({
    map: state.map,
    currentUser: state.currentUser,
    markers: state.markers
});

const mapDispatchToProps = (dispatch) => ({
    requestContainers: () => {
        dispatch(requestContainers());
        dispatch(receiveContainers(osm_layers));
    },
    markersObjects: (user) => {
        return axios.get('/api/markers', { params: { userId: user.id } })
            .then((response) => {
                dispatch(markersObjects(response.data));
            });
        // dispatch(markersObjects(markers));
    }
});

@connect(
    mapStateToProps,
    mapDispatchToProps
)
export default class TLContainer extends React.Component {
    constructor(props) {
        super(props);
    }

    componentDidMount = () => {
        this.props.requestContainers();
        this.props.markersObjects(this.props.currentUser);
    }

    render() {
        return (
            <div>
                <TLToolbar {...this.props} />
                <div id='tl-panel-left'>
                    <TLPanel docked={false} pullRight={false} title="Слоеве" action="layers" {...this.props} />
                </div>
                <div id='tl-panel-right'>
                    <TLPanel docked={false} pullRight={true} title="Маркери" action="markers" {...this.props} />
                </div>
                <TLMap {...this.props} />
            </div>
        )
    }
}
