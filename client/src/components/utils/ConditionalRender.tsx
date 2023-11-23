type ThisProps = {
  truthyCondition: boolean;
  children: React.ReactNode;
  falseCaseElement?: React.ReactNode;
};

// pass truthy values as children to this component

const ConditionalRender = ({
  truthyCondition,
  children,
  falseCaseElement = null,
}: ThisProps) => {
  return truthyCondition ? children : falseCaseElement;
};

export default ConditionalRender;
