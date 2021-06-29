import {useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import { Box, Button, FormHelperText, Paper, Typography } from '@material-ui/core';
import QuillEditor from '../../QuillEditor';
import {updateProjectDescription} from "../../../slices/project";
import {useDispatch, useSelector} from "../../../store";
import axios from "../../../lib/axios";

const ProjectDescriptionForm = (props) => {
  const { onBack, onComplete, ...other } = props;
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const dispatch = useDispatch();
  const { description } = useSelector((state) => state.project);
  const { name, tags, startDate, endDate } = useSelector((state) => state.project);

  const handleQuillEditorChange = (value) => {
    setContent(value);
  };

  const goBack = () => {
    dispatch(updateProjectDescription(content));
    onBack();
  };

  useEffect(() => {
    setContent(description);
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      setIsSubmitting(true);

      const response = await axios.post('/projects', {
        project: {
          name: name,
          tags: tags,
          startDate: startDate.toDateString(),
          endDate: endDate.toDateString(),
          description: content
        }
      });

      if (response.data.success) {
        if (onComplete) {
          onComplete();
        }
      }
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      {...other}
    >
      <Paper elevation={0} sx={{ p: 3 }}>
        <Typography
          color="textPrimary"
          variant="h6"
        >
          Project Description
        </Typography>
        <Paper
          sx={{ mt: 3 }}
          variant="outlined"
        >
          <QuillEditor
            onChange={handleQuillEditorChange}
            placeholder="Write something"
            sx={{ height: 400 }}
            value={content}
          />
        </Paper>
        {error && (
          <Box sx={{ mt: 2 }}>
            <FormHelperText error>
              {FormHelperText}
            </FormHelperText>
          </Box>
        )}
        <Box
          sx={{
            display: 'flex',
            mt: 6
          }}
        >
          {onBack && (
            <Button
              color="primary"
              onClick={goBack}
              size="large"
              variant="text"
            >
              Previous
            </Button>
          )}
          <Box sx={{ flexGrow: 1 }} />
          <Button
            color="primary"
            disabled={isSubmitting}
            type="submit"
            size="large"
            variant="contained"
          >
            Complete
          </Button>
        </Box>
      </Paper>
    </form>
  );
};

ProjectDescriptionForm.propTypes = {
  onBack: PropTypes.func,
  onComplete: PropTypes.func
};

export default ProjectDescriptionForm;
