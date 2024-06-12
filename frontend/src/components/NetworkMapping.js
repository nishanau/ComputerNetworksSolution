import React, { useEffect, useRef } from 'react';
import { DataSet, Network } from 'vis-network/standalone';

const NetworkMapping = ({ data }) => {
  const networkContainer = useRef(null);
  const network = useRef(null);

  useEffect(() => {
    if (network.current) {
      network.current.destroy();
    }

    const nodes = new DataSet(data.nodes);
    const edges = new DataSet(data.edges);

    const container = networkContainer.current;
    const options = {
      groups: {
        router: { shape: 'image', image: '/router.png' },
        switch: { shape: 'image', image: '/switch.png' },
        department: { shape: 'box' },
        ip: { shape: 'dot' },
        summary: { shape: 'ellipse', color: { background: '#FFDD44', border: '#FFAA00' } }
      },
      physics: {
        enabled: true,
        stabilization: {
          iterations: 1000,
        },
      },
      interaction: {
        dragNodes: true,
        dragView: true,
        zoomView: true,
      },
    };

    network.current = new Network(container, { nodes, edges }, options);
  }, [data]);

  return <div ref={networkContainer} style={{ height: '100%' }} />;
};

export default NetworkMapping;
