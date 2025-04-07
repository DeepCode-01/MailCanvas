import LeadSourceNode from './nodes/LeadSourceNode';
import EmailNode from './nodes/ColdEmailNode';
import DelayNode from './nodes/WaitDelayNode';

const nodeTypes = {
  leadSource: LeadSourceNode,
  email: EmailNode,
  delay: DelayNode
};

export default nodeTypes;