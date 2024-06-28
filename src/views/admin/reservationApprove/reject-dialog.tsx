import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
  Button,
  Autocomplete,
  Checkbox
} from '@mui/material';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxIcon from '@mui/icons-material/CheckBox';

const initialPredefinedReasons = [
  'Incomplete Application',
  'Insufficient Funds',
  'Missing Documents',
  'Failed Background Check',
  'Overcapacity'
];

const RejectDialog = ({ open, onClose, onSubmit, studentIds }) => {
  const [selectedReasons, setSelectedReasons] = useState([]);
  const [predefinedReasons, setPredefinedReasons] = useState(initialPredefinedReasons);
  const [customReason, setCustomReason] = useState('');

  useEffect(() => {
    if (!open) {
      setSelectedReasons([]);
      setPredefinedReasons(initialPredefinedReasons);
      setCustomReason('');
    }
  }, [open]);

  const handleSelectChange = (event, newValue) => {
    setSelectedReasons(newValue);
  };

  const handleCustomReasonChange = event => {
    setCustomReason(event.target.value);
  };

  const handleAddCustomReason = () => {
    if (customReason && !selectedReasons.includes(customReason)) {
      const newReasons = [...predefinedReasons, customReason];
      setSelectedReasons([...selectedReasons, customReason]);
      setPredefinedReasons(newReasons);
      setCustomReason('');
    }
  };

  const handleSubmit = () => {
    onSubmit(selectedReasons);
    onClose();
  };

  const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
  const checkedIcon = <CheckBoxIcon fontSize="small" />;

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Enter Rejection Reasons</DialogTitle>
      <DialogContent>
        <DialogContentText>Please enter the rejection reasons for {studentIds.join(', ')}</DialogContentText>
        <div style={{ marginTop: '20px' }}>
          <Autocomplete
            multiple
            id="checkboxes-tags-demo"
            options={predefinedReasons}
            disableCloseOnSelect
            value={selectedReasons}
            onChange={handleSelectChange}
            renderOption={(props, option, { selected }) => (
              <li {...props}>
                <Checkbox icon={icon} checkedIcon={checkedIcon} style={{ marginRight: 8 }} checked={selected} />
                {option}
              </li>
            )}
            style={{ width: '100%' }}
            renderInput={(params) => <TextField {...params} label="Rejection Reasons" placeholder="Select reasons" />}
          />
        </div>

        <TextField
          margin="dense"
          id="custom-reason"
          label="Add Custom Reason"
          type="text"
          fullWidth
          value={customReason}
          onChange={handleCustomReasonChange}
          onKeyPress={(event) => {
            if (event.key === 'Enter') {
              event.preventDefault();
              handleAddCustomReason();
            }
          }}
        />
        <Button onClick={handleAddCustomReason} color="primary">
          Add Custom Reason
        </Button>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Cancel
        </Button>
        <Button onClick={handleSubmit} color="primary">
          Submit
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default RejectDialog;