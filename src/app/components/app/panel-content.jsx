import React from 'react';

import TLPanelHeader from './panel-header';
import TLPanelBodyLayers from './panel-body-layers';
import TLPanelBodyMarkers from './panel-body-markers';

const styles = {
    sidebar: {
        height: '100%'
    }
};

const TLPanelContent = (props) => {
    return (
        <div style={styles.sidebar}>
            <TLPanelHeader {...props} />
            {props.action == 'layers'
                ? <TLPanelBodyLayers {...props} />
                : <TLPanelBodyMarkers {...props} />
            }
        </div>
    );
}

export default TLPanelContent;
