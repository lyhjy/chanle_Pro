const businessCost = (req , res ) => {
  res.json({data: [{
      orderNum: '29013789126391267',
    }]})
}

export default {
  'GET /chanle/selectBusinessCost': businessCost,
};
