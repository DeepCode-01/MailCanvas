import LeadSourceNode from './nodes/LeadSourceNode';
import EmailNode from './nodes/EmailNode';
import DelayNode from './nodes/DelayNode';

const nodeTypes = {
  leadSource: LeadSourceNode,
  email: EmailNode,
  delay: DelayNode
};

export default nodeTypes;